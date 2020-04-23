import { times } from 'lodash';
import { Chains } from './chain';
import logger from '../logger';

const initializeChains = (
  experimentName,
  lengthOfChain,
  numberOfSeeds,
  numberOfChainsPerSeed,
  positionOfMachineSolution,
  hasMachineSolution,
  batchId,
  startingSolutionModelName,
  machineSolutionModelName,
  previousSolutionAnimationDurationInSeconds
) => {
  logger.log({
    level: 'info',
    message: `Initializing ${numberOfSeeds *
      numberOfChainsPerSeed} chains for experiment ${experimentName}, number of seeds: ${numberOfSeeds} number of chains per seed: ${numberOfChainsPerSeed}`,
  });

  times(numberOfSeeds, seed => {
    times(numberOfChainsPerSeed, () => {
      const chain = {
        batchId,
        experimentName,
        hasMachineSolution,
        lengthOfChain,
        startingSolutionModelName,
        machineSolutionModelName,
        previousSolutionAnimationDurationInSeconds,
        randomNumberForSorting: Math.random(), // this value is updated every 30 seconds
        seed,
        positionOfMachineSolution: hasMachineSolution ? positionOfMachineSolution : null,
      };
      Chains.create(chain);
    });
  });
};

export default initializeChains;
