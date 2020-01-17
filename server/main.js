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

const solutions = Solutions.loadAll();
console.log(solutions);
printDatabaseStatistics();
resetDatabase(); // TODO this should be disabled in production
printDatabaseStatistics();
initializeDatabase();
printDatabaseStatistics();

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit((game, treatment, players) => {
  const { numberOfRounds, roundDuration } = treatment;

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

  _.times(numberOfRounds, i => {
    const round = game.addRound();
    const stageDurations =
      availableStageDurations[
        getRandomInteger(0, availableStageDurations.length - 1)
      ];
    round.addStage({
      name: "plan",
      displayName: "PLAN",
      durationInSeconds: stageDurations[0]
    });
    round.addStage({
      name: "response",
      displayName: "GO!",
      durationInSeconds: stageDurations[1]
    });
  });
});
