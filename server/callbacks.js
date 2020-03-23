import Empirica from "meteor/empirica:core";

import { Solutions } from "./solution";
import { ExperimentEnvironments } from "./experiment-environments";
import { Chains } from "./chain";
import * as machineSolutionService from "./machine-solution-service";
import { createTreatmentForSolution, pickChainFactorsFromChain } from "./utils";

Meteor.methods({
  fetchMachineSolution: function(params) {
    return machineSolutionService.fetchMachineSolution(params);
  }
});

const saveMachineSolution = (
  machineSolution,
  batchId,
  globalFactors,
  chainFactors,
  chainId,
  experimentName,
  previousSolutionId
) => {
  return Solutions.create({
    ...machineSolution,
    batchId,
    chainId,
    experimentName,
    previousSolutionId,
    treatment: createTreatmentForSolution(globalFactors, chainFactors),
    isValid: true,
    isMachineSolution: true,
    playerId: null
  });
};

const loadPreviousValidSolution = chainId => {
  const solutions = Solutions.loadValidSolutionsForChain(chainId);
  return solutions && solutions.length && solutions[solutions.length - 1];
};

Empirica.onRoundStart((game, round, players) => {
  const experimentName = game.get("experimentName");
  const globalFactors = game.get("globalFactors");
  const { batchId } = game;

  for (const player of players) {
    console.log(
      `Loading ExperimentEnvironments for playerId: ${player._id}, experimentName: ${experimentName}, batchId: ${batchId}`
    );

    const chain = Chains.loadNextChainForPlayer(player._id, batchId);

    if (!chain) {
      // There are no available chains for the player
      // TODO display error message to user or end the game
      console.error(`No chains available for player ${player._id}`);
      player.exit("No further games avaible for player.");
      return;
    }

    const chainFactors = pickChainFactorsFromChain(chain);
    const environment = ExperimentEnvironments.loadById(
      chain.experimentEnvironmentId
    );
    let previousSolutionInChain;
    if (chain.numberOfValidSolutions === 0) {
      // load initial solution
      const machineSolution = Meteor.call("fetchMachineSolution", {
        modelName: chainFactors.startingSolutionModelName,
        environment,
        previousSolution: null
      });

      // The machine solution is saved into the chain
      const machineSolutionId = saveMachineSolution(
        machineSolution,
        batchId,
        globalFactors,
        chainFactors,
        chain._id,
        experimentName,
        null // previousSolutionId
      );
      Chains.updateChainAfterRound(chain._id, null, 1);
      previousSolutionInChain = Solutions.loadById(machineSolutionId);
    } else {
      previousSolutionInChain = loadPreviousValidSolution(chain._id);
    }

    /*
     * We store the environment on the `player.round` object instead of the round object.
     * If there are multiple players in the game then each player should have a different chain and environment.
     */
    player.round.set("environment", environment);
    player.round.set("chain", chain);
    player.round.set(
      "previousSolutionInChain",
      previousSolutionInChain || { actions: [] }
    );
  }
});

Empirica.onRoundEnd((game, round, players) => {
  const experimentName = game.get("experimentName");
  const globalFactors = game.get("globalFactors");

  const { batchId } = game;
  for (const player of players) {
    const environment = player.round.get("environment");
    if (!environment) {
      // For some reason we are sometimes missing the environment.
      // This is just to survive these edge cases
      // TODO: finding the
      console.error(`No environment found.`);
      return;
    }

    if (environment.experimentName === "practice") {
      return;
    }
    console.log(
      `Saving solution game: ${game._id} player: ${player._id} round: ${round._id}`
    );
    const solution = player.round.get("solution") || {};
    const chain = player.round.get("chain");
    const chainFactors = pickChainFactorsFromChain(chain);
    Solutions.create({
      ...solution,
      batchId,
      treatment: createTreatmentForSolution(globalFactors, chainFactors),
      isMachineSolution: false,
      playerId: player._id
    });
    player.set("score", (player.get("score") || 0) + solution.totalReward);

    let numberOfValidSolutions = solution.isValid
      ? chain.numberOfValidSolutions + 1
      : chain.numberOfValidSolutions;

    // add machine solution to the chain
    if (
      chain.hasMachineSolution &&
      chain.positionOfMachineSolution === numberOfValidSolutions - 1
    ) {
      const previousSolution = loadPreviousValidSolution(chain._id);
      const machineSolution = Meteor.call("fetchMachineSolution", {
        modelName: chainFactors.machineSolutionModelName,
        environment,
        previousSolution
      });

      saveMachineSolution(
        machineSolution,
        batchId,
        globalFactors,
        chainFactors,
        chain._id,
        experimentName,
        previousSolution._id
      );
      numberOfValidSolutions++;
    }

    // releasing the chain lock
    Chains.updateChainAfterRound(chain._id, player._id, numberOfValidSolutions);
  }
});

// onGameEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd((game, players) => {});
