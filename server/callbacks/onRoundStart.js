import { Chains } from '../chains/chain';
import logger from '../logger';
import { pickChainFactorsFromChain } from '../utils';
import { saveMachineSolution, loadPreviousValidSolution, Solutions } from '../solutions/solution';
import fetchMachineSolution from '../machineSolutions/machineSolutionBackend';

const onRoundStart = (game, round, players) => {
  const globalFactors = game.get('globalFactors');
  const { numberOfActionsPerRound } = globalFactors;
  const isPractice = round.get('isPractice');
  const experimentName = isPractice ? 'practice' : game.get('experimentName');
  const { batchId } = game;

  players.forEach(async player => {
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
      const machineSolution = await fetchMachineSolution({
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
};

export default onRoundStart;
