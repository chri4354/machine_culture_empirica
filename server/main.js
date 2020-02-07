import Empirica from "meteor/empirica:core";

import "./network";
import "./callbacks.js";
import { Networks } from "./network";
import { Solutions } from "./solution";
import networks from "./networks.json";
import { getRandomInteger } from "./utils";
import { Chains } from "./chain";

function initializeChains(
  experimentName,
  lengthOfChain,
  numberOfChainsPerEnvironment,
  probabilityOfRobotSolutionInChain
) {
  // check if the chains have already been initialized for the experiment
  const chains = Chains.loadAll(experimentName);
  if (chains.length) {
    return;
  }

  console.log("Number of chains per env: ", numberOfChainsPerEnvironment);
  const networks = Networks.loadAll(experimentName);
  for (const network of networks) {
    // TODO bulk insert chains
    _.times(numberOfChainsPerEnvironment, i => {
      const hasRobotSolution =
        Math.random() < probabilityOfRobotSolutionInChain;
      const chain = {
        experimentName,
        networkId: network.id,
        hasRobotSolution: Math.random() < probabilityOfRobotSolutionInChain,
        positionOfRobotSolution:
          hasRobotSolution && getRandomInteger(0, lengthOfChain - 1)
      };
      console.log("CHAIN::");
      console.log(chain);
      Chains.create(chain);
    });
  }
}

const printDatabaseStatistics = () => {
  const numberOfNetworks = Networks.count();
  const numberOfSolutions = Solutions.count();
  const numberOfChains = Chains.count();

  console.log(
    "Current Database stats: ",
    JSON.stringify({ numberOfNetworks, numberOfSolutions, numberOfChains })
  );
};

const resetDatabase = () => {
  console.log("resetting database...");
  Networks.deleteAll();
  Solutions.deleteAll();
  Chains.deleteAll();
};

const initializeDatabase = () => {
  console.log("initializing the networks...");
  for (const network of networks) {
    Networks.create(network);
  }
};

Empirica.batchInit(batch => {
  console.log("------------------------");
  console.log("batchInit", batch);
  // TODO call initializeChains() here. We need to have access to the treatment/factors.
});

Empirica.gameInit((game, treatment, players) => {
  console.log(`Game Init: treatments: ${JSON.stringify(treatment)}`);
  const {
    experimentName,
    lengthOfChain,
    numberOfChainsPerEnvironment,
    numberOfRounds,
    probabilityOfRobotSolutionInChain
  } = treatment;

  // TODO call initializeChains() in the batchInit callback
  initializeChains(
    experimentName,
    lengthOfChain,
    numberOfChainsPerEnvironment,
    probabilityOfRobotSolutionInChain
  );

  game.players.forEach(player => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
  });

  game.set("experimentName", experimentName);

  const availableStageDurations = treatment.debug
    ? [
        [30, 20000],
        [30, 20000]
      ]
    : [
        [5, 25],
        [15, 15]
      ];

  const practiceNetworks = Networks.loadPracticeNetworks();
  const numberOfPracticeRounds =
    (practiceNetworks && practiceNetworks.length) || 0;
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

    // The player can view the network and plan their solution
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

printDatabaseStatistics();
const chains = Chains.loadAll();
console.log(chains[0]);
// resetDatabase();
// printDatabaseStatistics();
// initializeDatabase();
// printDatabaseStatistics();
