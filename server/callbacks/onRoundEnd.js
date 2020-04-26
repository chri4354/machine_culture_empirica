import logger from '../logger';
import { pickChainFactorsFromChain, createTreatmentForSolution } from '../utils';
import { Solutions, loadPreviousValidSolution, saveMachineSolution } from '../solutions/solution';
import { Chains } from '../chains/chain';
import fetchMachineSolution from '../machineSolutions/machineSolutionBackend';

const onRoundEnd = (game, round, players) => {
  const isPractice = round.get('isPractice');
  const experimentName = game.get('experimentName');
  const globalFactors = game.get('globalFactors');

  if (isPractice) {
    // practice solutions do not get saved
    return;
  }

  const { batchId } = game;
  players.forEach(async player => {
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
      level: 'info',
      message: `Saving solution game: ${game._id} player: ${player._id} round: ${round._id}`,
    });

    const solution = player.round.get('solution') || {};
    const chain = player.round.get('chain');
    const chainFactors = pickChainFactorsFromChain(chain);

    logger.log({
      level: 'debug',
      message: `Solution: ${JSON.stringify(solution, null, 2)}`,
    });

    Solutions.create({
      ...solution,
      batchId,
      treatment: createTreatmentForSolution(globalFactors, chainFactors),
      isMachineSolution: false,
      playerId: player._id,
    });

    if (solution.isValid) {
      player.set('score', (player.get('score') || 0) + solution.totalReward);
    } else {
      player.set('score', (player.get('score') || 0) - game.get('missingSolutionPenalty'));
    }

    let numberOfValidSolutions = solution.isValid
      ? chain.numberOfValidSolutions + 1
      : chain.numberOfValidSolutions;

    // Add machine solution to the chain.
    // When positionOfMachineSolution == 2, we want: Starting Solution > First Human > Machine Solution > Second Human > ...
    if (chain.hasMachineSolution && chain.positionOfMachineSolution === numberOfValidSolutions) {
      const previousSolution = loadPreviousValidSolution(chain._id);
      const machineSolution = await fetchMachineSolution({
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
};

export default onRoundEnd;
