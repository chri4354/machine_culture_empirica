import Empirica from 'meteor/empirica:core';
import { times } from 'lodash';

import './callbacks';
import { Solutions } from './solution';
import { Chains } from './chains/chain';
import initializeChains from './chains/initializeChains';
import logger from './logger';

/**
 * Updates the chain.randomNumberForSorting value every 30 seconds
 * so that players always get a random chain from the set of longest chains
 */
setInterval(
  Meteor.bindEnvironment(() => {
    Chains.updateRandomNumbersForSorting();
    logger.log({ level: 'debug', message: 'Randomizing Chain sort' });
  }),
  30 * 1000
);

Empirica.batchInit((batch, treatments) => {
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
});

Empirica.gameInit((game, treatment) => {
  logger.log({
    level: 'info',
    message: `Game Init: treatments: ${JSON.stringify(treatment)}`,
  });

  const {
    debug,
    experimentName,
    lengthOfChain,
    numberOfRounds,
    numberOfSeeds,
    numberOfChainsPerSeed,
    numberOfActionsPerRound,
    planningStageDurationInSeconds,
    playerCount,
    responseStageDurationInSeconds,
  } = treatment;

  game.players.forEach(player => {
    player.set('avatar', `/avatars/jdenticon/${player._id}`);
    player.set('score', 0);
  });

  const reviewStageDurationInSeconds = 5;

  game.set('experimentName', experimentName);
  game.set('globalFactors', {
    debug,
    experimentName,
    lengthOfChain,
    numberOfSeeds,
    numberOfChainsPerSeed,
    numberOfRounds,
    numberOfActionsPerRound,
    planningStageDurationInSeconds,
    playerCount,
    responseStageDurationInSeconds,
    reviewStageDurationInSeconds,
  });

  const numberOfPracticeRounds = 2;

  times(numberOfRounds + numberOfPracticeRounds, index => {
    const round = game.addRound();

    const isPractice = index < numberOfPracticeRounds;
    round.set('isPractice', isPractice);

    // The player can view the map and plan their solution
    round.addStage({
      name: 'plan',
      displayName: 'Watch previous player',
      durationInSeconds: planningStageDurationInSeconds,
    });

    // The player can select their solution
    round.addStage({
      name: 'response',
      displayName: 'Play yourself',
      durationInSeconds: responseStageDurationInSeconds,
    });

    // The player can review their score
    round.addStage({
      name: 'review',
      displayName: 'Review results',
      durationInSeconds: reviewStageDurationInSeconds,
    });
  });
});

// eslint-disable-next-line no-unused-vars
const resetDatabase = () => {
  logger.log({
    level: 'info',
    message: 'resetting database...',
  });
  Solutions.deleteAll();
  Chains.deleteAll();
};

// eslint-disable-next-line no-unused-vars
const printDatabaseStatistics = () => {
  const numberOfSolutions = Solutions.count();
  const numberOfChains = Chains.count();

  logger.log({
    level: 'info',
    message: `Current Database stats: ${JSON.stringify({ numberOfSolutions, numberOfChains })}`,
  });
};

// resetDatabase();
// printDatabaseStatistics();
