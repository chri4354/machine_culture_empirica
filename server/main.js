import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import { ExperimentEnvironments } from "./experiment-environments";
import { Solutions } from "./solution";
import experimentEnvironmentsJson from "./experimentEnvironments.json";
import machineSolutionsJson from "./machineSolutions.json";
import { MachineSolutions } from "./machine-solution";
import { Chains } from "./chain";

/**
 * Updates the chain.randomNumberForSorting value every 30 seconds
 * so that players always get a random chain from the set of longest chains
 */
setInterval(
  Meteor.bindEnvironment(() => {
    Chains.updateRandomNumbersForSorting();
  }),
  30 * 1000
);

function initializeChains(
  experimentName,
  lengthOfChain,
  numberOfChainsPerEnvironment,
  positionOfMachineSolution,
  hasMachineSolution
) {
  console.log(
    `Initializing chains for experiment ${experimentName}, Number of chains per env: ${numberOfChainsPerEnvironment}`
  );

  const experimentEnvironments = ExperimentEnvironments.loadAll(experimentName);
  for (const experimentEnvironment of experimentEnvironments) {
    [...Array(numberOfChainsPerEnvironment).keys()].map(i => {
      const chain = {
        experimentName,
        hasMachineSolution,
        lengthOfChain,
        randomNumberForSorting: Math.random(), // this value is updated every 30 seconds
        experimentEnvironmentId: experimentEnvironment._id,
        positionOfMachineSolution: hasMachineSolution
          ? positionOfMachineSolution
          : null
      };
      Chains.create(chain);
    });
  }
}

const printDatabaseStatistics = () => {
  const numberOfExperimentEnvironments = ExperimentEnvironments.count();
  const numberOfSolutions = Solutions.count();
  const numberOfChains = Chains.count();
  const numberOfMachineSolutions = MachineSolutions.count();

  console.log(
    "Current Database stats: ",
    JSON.stringify({
      numberOfExperimentEnvironments,
      numberOfSolutions,
      numberOfChains,
      numberOfMachineSolutions
    })
  );
};

const resetDatabase = () => {
  console.log("resetting database...");
  ExperimentEnvironments.deleteAll();
  Solutions.deleteAll();
  Chains.deleteAll();
  MachineSolutions.deleteAll();
};

const initializeDatabase = () => {
  console.log("initializing the experimentEnvironments...");
  for (const experimentEnvironments of experimentEnvironmentsJson) {
    ExperimentEnvironments.create(experimentEnvironments);
  }
  for (const machineSolution of machineSolutionsJson) {
    MachineSolutions.create(machineSolution);
  }
};

Empirica.batchInit((batch, treatments) => {
  for (const treatment of treatments) {
    initializeChains(
      treatment.experimentName,
      treatment.lengthOfChain,
      treatment.numberOfChainsPerEnvironment,
      treatment.positionOfMachineSolution,
      treatment.chainsHaveMachineSolution
    );
  }
});

Empirica.gameInit((game, treatment, players) => {
  console.log(`Game Init: treatments: ${JSON.stringify(treatment)}`);
  const {
    experimentName,
    numberOfRounds,
    planningStageDurationInSeconds,
    responseStageDurationInSeconds,
    debug
  } = treatment;

  game.players.forEach(player => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
  });

  game.set("experimentName", experimentName);

  const practiceExperimentEnvironments = ExperimentEnvironments.loadPracticeExperimentEnvironments();
  const numberOfPracticeRounds =
    (practiceExperimentEnvironments && practiceExperimentEnvironments.length) ||
    0;
  _.times(numberOfPracticeRounds + numberOfRounds, i => {
    const round = game.addRound();

    const isPractice = i < numberOfPracticeRounds;
    let stageDurationMultiplier = isPractice ? 2 : 1;
    stageDurationMultiplier = debug ? stageDurationMultiplier * 1 : 1;

    const reviewStageDurationInSeconds = 5;

    round.set("environment", {
      planningStageDurationInSeconds,
      responseStageDurationInSeconds,
      reviewStageDurationInSeconds
    });

    // The player can view the environment and plan their solution
    round.addStage({
      name: "plan",
      displayName: "Watch previous player",
      durationInSeconds:
        planningStageDurationInSeconds * stageDurationMultiplier
    });

    // The player can select their solution
    round.addStage({
      name: "response",
      displayName: "Play yourself",
      durationInSeconds:
        responseStageDurationInSeconds * stageDurationMultiplier
    });

    // The player can review their score
    round.addStage({
      name: "review",
      displayName: "Review results",
      durationInSeconds: reviewStageDurationInSeconds * stageDurationMultiplier
    });
  });
});

// resetDatabase();
// printDatabaseStatistics();
// initializeDatabase();
printDatabaseStatistics();
