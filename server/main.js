import Empirica from "meteor/empirica:core";

import "./environment";
import "./callbacks.js";
import { Environments } from "./environment";
import networks from "./networks.json";
import { getRandomInteger } from "./utils";

// TODO this should be disabled in production
const resetDatabase = () => {
  Environments.deleteAll();
};
let numberOfEnvironments = Environments.count();
console.log(
  "Number of environments stored in Mongo before reset: ",
  numberOfEnvironments
);
resetDatabase();

numberOfEnvironments = Environments.count();
console.log("Number of environments stored in Mongo: ", numberOfEnvironments);
if (numberOfEnvironments === 0) {
  console.log("initializing the environments");
  for (const network of networks) {
    Environments.insert(network);
  }
}

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit((game, treatment, players) => {
  const { numberOfRounds, roundDuration } = treatment;

  const environments = Environments.loadAll();
  game.players.forEach(player => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
  });

  const possibleStageDurations = treatment.debug
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
    round.set("network", environments[Math.min(i, environments.length - 1)]); // TODO How are environments chosen for a round?
    const stageDurations =
      possibleStageDurations[
        getRandomInteger(0, possibleStageDurations.length - 1)
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
