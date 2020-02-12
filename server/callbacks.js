import Empirica from "meteor/empirica:core";

import { Solutions } from "./solution";
import { ExperimentEnvironments } from "./experiment-environments";
import { Chains } from "./chain";

Empirica.onRoundStart((game, round, players) => {
  const experimentName = game.get("experimentName");
  const { batchId } = game;
  for (const player of players) {
    console.log(
      `Loading ExperimentEnvironments for player ${player._id}, experiment ${experimentName}`
    );

    const chain = Chains.loadNextChainForPlayer(player._id);

    if (!chain) {
      // There are no available chains for the player
      // TODO display error message to user or end the game
      console.error(`No chains available for player ${player._id}`);
      return;
    }

    const environment = ExperimentEnvironments.loadById(chain.experimentEnvironmentId);
    const solutions = Solutions.loadValidSolutionsForChain(chain._id);

    /*
     * We store the environment on the `player.round` object instead of the round object.
     * If there are multiple players in the game then each player should have a different chain and environment.
     */
    player.round.set("environment", environment);
    player.round.set("chain", chain);
    player.round.set(
      "previousSolutionInChain",
      (solutions && solutions.length && solutions[solutions.length - 1]) || {
        actions: []
      }
    );
  }
});

Empirica.onRoundEnd((game, round, players) => {
  const { batchId, treatment } = game;
  for (const player of players) {
    const { experimentName } = player.round.get("environment");
    if (experimentName === "practice") {
      return;
    }
    console.log(
      `Saving solution game: ${game._id} player: ${player._id} round: ${round._id}`
    );
    const solution = player.round.get("solution") || {};
    const chain = player.round.get("chain");
    Solutions.create({
      ...solution,
      batchId,
      treatment,
      experimentApplicationVersion: "2.0--2019-02-10",
      playerId: player._id
    });
    player.set("score", (player.get("score") || 0) + solution.totalReward);

    // TODO if the next solution is a robot solution then add that solution

    Chains.updateChainAfterRound(
      chain._id,
      player._id,
      solution.isValid ? chain.numberOfValidSolutions + 1 : chain.numberOfValidSolutions
    );
  }
});

// onGameEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd((game, players) => {});
