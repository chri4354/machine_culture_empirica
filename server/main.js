import Empirica from "meteor/empirica:core";

import "./network";
import "./callbacks.js";
import { Networks } from "./network";
import { Solutions } from "./solution";
import networks from "./networks.json";
import { getRandomInteger } from "./utils";

const printDatabaseStatistics = () => {
  const numberOfNetworks = Networks.count();
  const numberOfSolutions = Solutions.count();

  console.log(
    "Current Database stats: ",
    JSON.stringify({ numberOfNetworks, numberOfSolutions })
  );
};

const resetDatabase = () => {
  console.log("resetting database...");
  Networks.deleteAll();
};

const initializeDatabase = () => {
  console.log("initializing the networks...");
  for (const network of networks) {
    Networks.create(network);
  }
};

printDatabaseStatistics();

// resetDatabase();
// printDatabaseStatistics();
// initializeDatabase();
// printDatabaseStatistics();

Empirica.batchInit(batch => {
  console.log("batchInit", batch);
});

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit((game, treatment, players) => {
  const { experimentName } = treatment;

  game.players.forEach(player => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
  });

  const availableStageDurations = treatment.debug
    ? [
        [1, 20000],
        [1, 20000]
      ]
    : [
        [5, 25],
        [15, 15]
      ];

  const practiceNetworks = Networks.loadPracticeNetworks();
  const mainNetworks = _.shuffle(Networks.loadAll(experimentName));
  const networks = [...practiceNetworks, ...mainNetworks];
  _.times(networks.length, i => {
    const round = game.addRound();
    const stageDurations =
      availableStageDurations[
        getRandomInteger(0, availableStageDurations.length - 1)
      ];

    const network = networks[i];
    const isPractice = network.experimentName === "practice";
    const stageDurationMultiplier = isPractice ? 2 : 1;
    const planningStageDurationInSeconds =
      stageDurations[0] * stageDurationMultiplier;
    const responseStageDurationInSeconds = stageDurations[1] * stageDurationMultiplier;
    const reviewStageDurationInSeconds = 5 * stageDurationMultiplier;

    round.set("environment", {
      planningStageDurationInSeconds,
      responseStageDurationInSeconds,
      reviewStageDurationInSeconds,
      network: networks[i],
      solutions: []
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
