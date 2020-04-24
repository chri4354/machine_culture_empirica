import { random } from 'lodash';

/**
 * Returns the object that will be stored as solution.treatment
 */
export const createTreatmentForSolution = (globalFactors, chainFactors) => {
  return {
    ...globalFactors,
    ...chainFactors,
  };
};

/**
 * This will return the chain factors from a chain or treatment
 */
export const pickChainFactorsFromChain = chainOrTreatment => {
  const {
    hasMachineSolution,
    machineSolutionModelName,
    positionOfMachineSolution,
    previousSolutionAnimationDurationInSeconds,
    startingSolutionModelName,
  } = chainOrTreatment;

  return {
    hasMachineSolution,
    machineSolutionModelName,
    positionOfMachineSolution,
    previousSolutionAnimationDurationInSeconds,
    startingSolutionModelName,
  };
};

/**
 * Get a random click action. Because Canvas has a height and width 500px, the clicks (x/y) are quantized to 0.002 steps from 0 to 1.
 */
export const getRandomClickAction = () => {
  const getRandom = () => (random(0, 500) / 1000).toFixed(3) * 2;

  return { x: getRandom(), y: getRandom() };
};

// (0 to 500 pixel) => (0 to 1)
export const pixelsFrom0to1 = number => (number / 1000).toFixed(3) * 2;
