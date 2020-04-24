import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';
import { fetchRandomReward } from './gameBackend';

const fetchMachineSolution = async ({
  modelName,
  seed,
  previousSolution,
  numberOfActionsPerRound,
}) => {
  logger.log({
    level: 'debug',
    message: `Fetching 4 Machine Solutions with params: ${JSON.stringify({
      modelName,
      seed,
      previousSolution,
    })}`,
  });

  const actions = await Promise.all(
    [...Array(numberOfActionsPerRound).keys()].map(async () => fetchRandomReward({ seed }))
  );

  const totalReward = actions.reduce((acc, curr) => acc + curr.reward, 0);

  logger.log({
    level: 'info',
    message: `Machine solution actions ${JSON.stringify(actions)}`,
  });

  const actionsWithStep = actions.map(({ x, y, reward }, i) => ({
    x,
    y,
    reward,
    step: i + 1,
  }));

  const solution = {
    actions: actionsWithStep,
    modelName,
    solutionId: uuidv4(),
    seed,
    totalReward,
  };

  logger.log({
    level: 'debug',
    message: JSON.stringify(solution, null, 2),
  });

  return solution;
};

export default fetchMachineSolution;
