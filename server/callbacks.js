import Empirica from 'meteor/empirica:core';

import { Solutions } from './solution';
import { Chains } from './chains/chain';
import fetchMachineSolution from './machineSolutions/machine-solution-service';
import { createTreatmentForSolution, pickChainFactorsFromChain } from './utils';
import logger from './logger';

Meteor.methods({
  fetchMachineSolution(params) {
    return fetchMachineSolution(params);
  },
});

const saveMachineSolution = (
  machineSolution,
  batchId,
  globalFactors,
  chainFactors,
  chainId,
  experimentName,
  previousSolutionId
) => {
  return Solutions.create({
    ...machineSolution,
    batchId,
    chainId,
    experimentName,
    previousSolutionId,
    treatment: createTreatmentForSolution(globalFactors, chainFactors),
    isValid: true,
    isMachineSolution: true,
    playerId: null,
  });
};

const loadPreviousValidSolution = chainId => {
  const solutions = Solutions.loadValidSolutionsForChain(chainId);
  return solutions && solutions.length && solutions[solutions.length - 1];
};

Empirica.onRoundStart((game, round, players) => {
  const globalFactors = game.get('globalFactors');
  const { numberOfActionsPerRound } = globalFactors;
  const isPractice = round.get('isPractice');
  const experimentName = isPractice ? 'practice' : game.get('experimentName');
  const { batchId } = game;

  players.forEach(player => {
    logger.log({
      level: 'info',
      message: `Loading Seeds for playerId: ${player._id}, experimentName: ${experimentName}, batchId: ${batchId}`,
    });

    /**
     * For practice rounds, load a random chain without locking it.
     */
    let chain = isPractice
      ? Chains.loadRandomChain(batchId)
      : Chains.loadNextChainForPlayer(player._id, batchId);

    if (!chain) {
      // There are no available chains for the player
      // TODO display error message to user or end the game
      logger.log({
        level: 'error',
        message: `No chains available for player ${player._id}`,
      });
      player.exit('No further games available for player.');
      return;
    }

    logger.log({
      level: 'debug',
      message: `Loaded Chain: ${JSON.stringify(chain, null, 2)}`,
    });

    const chainFactors = pickChainFactorsFromChain(chain);

    // Start from seed 1, seed 0 generates random rewards
    const seed = isPractice ? round.index + 1 : chain.seed;
    let previousSolutionInChain;

    if (isPractice || chain.numberOfValidSolutions === 0) {
      /**
       * Load the initial solution.
       * Practice rounds always use the machineStartingSolution as the previous solution.
       */
      const machineSolution = Meteor.call('fetchMachineSolution', {
        modelName: chainFactors.startingSolutionModelName,
        seed,
        previousSolution: null,
        numberOfActionsPerRound,
      });

      if (isPractice) {
        previousSolutionInChain = machineSolution;
      } else {
        // The machine solution is saved into the chain
        const machineSolutionId = saveMachineSolution(
          machineSolution,
          batchId,
          globalFactors,
          chainFactors,
          chain._id,
          experimentName,
          null // previousSolutionId
        );
        Chains.incrementNumberOfValidSolutions(chain._id);
        chain = Chains.loadById(chain._id);
        previousSolutionInChain = Solutions.loadById(machineSolutionId);
      }
    } else {
      previousSolutionInChain = loadPreviousValidSolution(chain._id);
    }

    /*
     * We store the seed on the `player.round` object instead of the round object.
     * If there are multiple players in the game then each player should have a different chain and seed.
     */
    player.round.set('seed', seed);
    player.round.set('chain', chain);
    player.round.set('previousSolutionInChain', previousSolutionInChain || { actions: [] });
  });
});

Empirica.onRoundEnd((game, round, players) => {
  const isPractice = round.get('isPractice');
  const experimentName = game.get('experimentName');
  const globalFactors = game.get('globalFactors');

  if (isPractice) {
    // practice solutions do not get saved
    return;
  }

  const { batchId } = game;
  players.forEach(player => {
    const seed = player.round.get('seed');
    if (!seed) {
      // For some reason we are sometimes missing the seed.
      // This is just to survive these edge cases
      // TODO: finding the
      logger.log({
        level: 'error',
        message: `No seed found`,
      });
      return;
    }

    logger.log({
      level: 'debug',
      message: `Saving solution game: ${game._id} player: ${player._id} round: ${round._id}`,
    });

    const solution = player.round.get('solution') || {};
    const chain = player.round.get('chain');
    const chainFactors = pickChainFactorsFromChain(chain);
    Solutions.create({
      ...solution,
      batchId,
      treatment: createTreatmentForSolution(globalFactors, chainFactors),
      isMachineSolution: false,
      playerId: player._id,
    });
    player.set('score', (player.get('score') || 0) + solution.totalReward);

    let numberOfValidSolutions = solution.isValid
      ? chain.numberOfValidSolutions + 1
      : chain.numberOfValidSolutions;

    // Add machine solution to the chain.
    // When positionOfMachineSolution == 2, we want: Starting Solution > First Human > Machine Solution > Second Human > ...
    if (chain.hasMachineSolution && chain.positionOfMachineSolution === numberOfValidSolutions) {
      const previousSolution = loadPreviousValidSolution(chain._id);
      const machineSolution = Meteor.call('fetchMachineSolution', {
        modelName: chainFactors.machineSolutionModelName,
        seed,
        previousSolution,
      });

      saveMachineSolution(
        machineSolution,
        batchId,
        globalFactors,
        chainFactors,
        chain._id,
        experimentName,
        previousSolution._id
      );
      numberOfValidSolutions += numberOfValidSolutions;
    }

    // releasing the chain lock
    Chains.updateChainAfterRound(chain._id, player._id, numberOfValidSolutions);
  });
});

// onGameEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd(() => {});
