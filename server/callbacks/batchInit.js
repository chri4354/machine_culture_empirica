import initializeChains from '../chains/initializeChains';

const batchInit = (batch, treatments) => {
  treatments.forEach(treatment => {
    initializeChains(
      treatment.experimentName,
      /**
       * The length of the chain is increased by one because the starting machine
       * solution, which is fetched from an external API, has to be saved in the chain
       */
      treatment.lengthOfChain + 1,
      treatment.numberOfSeeds,
      treatment.numberOfChainsPerSeed,
      treatment.positionOfMachineSolution,
      treatment.chainsHaveMachineSolution,
      batch._id,
      treatment.startingSolutionModelName,
      treatment.machineSolutionModelName,
      treatment.previousSolutionAnimationDurationInSeconds
    );
  });
};

export default batchInit;
