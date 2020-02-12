import Empirica from "meteor/empirica:core";

import "./experiment-environments";
import "./callbacks.js";
import { ExperimentEnvironments } from "./experiment-environments";
import { Solutions } from "./solution";
import experimentEnvironmentsJson from "./experimentEnvironments.json";
import { getRandomInteger } from "./utils";
import { Chains } from "./chain";

/**
 * Updates the chain.randomNumberForSorting value every 20 seconds
 * so that players always get a random chain from the set of longest chains
 */
setInterval(
  Meteor.bindEnvironment(() => {
    Chains.updateRandomNumbersForSorting();
  }),
  20 * 1000
);

function initializeChains(
  experimentName,
  lengthOfChain,
  numberOfChainsPerEnvironment,
  positionOfMachineSolution
) {
  console.log(`Initializing chains for experiment ${experimentName}`);
  // check if the chains have already been initialized for the experiment
  const chains = Chains.loadAll(experimentName);
  if (chains.length) {
    return;
  }

  console.log("Number of chains per env: ", numberOfChainsPerEnvironment);
  const experimentEnvironments = ExperimentEnvironments.loadAll(experimentName);
  for (const experimentEnvironment of experimentEnvironments) {
    [...Array(numberOfChainsPerEnvironment).keys()].map(i => {
      const hasRobotSolution = Math.random() < 0.5;
      const chain = {
        experimentName,
        hasRobotSolution,
        lengthOfChain,
        randomNumberForSorting: Math.random(), // this value is updated every 20 seconds
        experimentEnvironmentId: experimentEnvironment._id,
        positionOfMachineSolution: hasRobotSolution
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

  console.log(
    "Current Database stats: ",
    JSON.stringify({
      numberOfExperimentEnvironments,
      numberOfSolutions,
      numberOfChains
    })
  );
};

const resetDatabase = () => {
  console.log("resetting database...");
  ExperimentEnvironments.deleteAll();
  Solutions.deleteAll();
  Chains.deleteAll();
};

const initializeDatabaseForDebugging = () => {
  console.log("initializing the experimentEnvironments for debugging...");
  [...Array(10).keys()].map(i => {
    ExperimentEnvironments.create(experimentEnvironmentsJson[i]);
  });
};

const initializeDatabase = () => {
  console.log("initializing the experimentEnvironments...");
  for (const experimentEnvironments of experimentEnvironmentsJson) {
    ExperimentEnvironments.create(experimentEnvironments);
  }
};

Empirica.batchInit((batch, treatments) => {
  const {
    experimentName,
    lengthOfChain,
    numberOfChainsPerEnvironment,
    positionOfMachineSolution
  } = treatments[0];
  initializeChains(
    experimentName,
    lengthOfChain,
    numberOfChainsPerEnvironment,
    positionOfMachineSolution
  );
});

Empirica.gameInit((game, treatment, players) => {
  console.log(`Game Init: treatments: ${JSON.stringify(treatment)}`);
  const { experimentName, numberOfRounds } = treatment;

  game.players.forEach(player => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
  });

  game.set("experimentName", experimentName);

  const availableStageDurations = treatment.debug
    ? [
        [25, 20000],
        [25, 20000]
      ]
    : [
        [5, 25],
        [15, 15]
      ];

  const practiceExperimentEnvironments = ExperimentEnvironments.loadPracticeExperimentEnvironments();
  const numberOfPracticeRounds =
    (practiceExperimentEnvironments && practiceExperimentEnvironments.length) ||
    0;
  _.times(numberOfPracticeRounds + numberOfRounds, i => {
    const round = game.addRound();
    const stageDurations =
      availableStageDurations[
        getRandomInteger(0, availableStageDurations.length - 1)
      ];

    const isPractice = i < numberOfPracticeRounds;
    const stageDurationMultiplier = isPractice ? 2 : 1;
    const planningStageDurationInSeconds =
      stageDurations[0] * stageDurationMultiplier;
    const responseStageDurationInSeconds =
      stageDurations[1] * stageDurationMultiplier;
    const reviewStageDurationInSeconds = 5 * stageDurationMultiplier;

    round.set("environment", {
      planningStageDurationInSeconds,
      responseStageDurationInSeconds,
      reviewStageDurationInSeconds
    });

    // The player can view the environment and plan their solution
    round.addStage({
      name: "plan",
      displayName: "PLAN",
      durationInSeconds: planningStageDurationInSeconds
    });

    // The player can select their solution
    round.addStage({
      name: "response",
      displayName: "GO!",
      durationInSeconds: responseStageDurationInSeconds
    });

    // The player can review their score
    round.addStage({
      name: "review",
      displayName: "REVIEW",
      durationInSeconds: reviewStageDurationInSeconds
    });
  });
});

// resetDatabase();
printDatabaseStatistics();
// resetDatabase();
// initializeDatabase();
// initializeDatabaseForDebugging();
// initializeChains();
// printDatabaseStatistics();
