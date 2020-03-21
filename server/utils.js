/**
 * Returns the object that will be stored as solution.treatment
 */
export const createTreatmentForSolution = (globalFactors, chainFactors) => {
  return {
    ...globalFactors,
    ...chainFactors
  };
};

/**
 * This will return the chain factors from a chain or treatment
 */
export const pickChainFactorsFromChain = chainOrTreatment => {
  const {
    chainsHaveMachineSolution,
    machineSolutionModelName,
    positionOfMachineSolution,
    startingSolutionModelName
  } = chainOrTreatment;

  return {
    chainsHaveMachineSolution,
    machineSolutionModelName,
    positionOfMachineSolution,
    startingSolutionModelName
  };
};
