import { times } from 'lodash';
import logger from '../logger';

const gameInit = (game, treatment) => {
  logger.log({
    level: 'info',
    message: `Game Init: treatments: ${JSON.stringify(treatment)}`,
  });

  const {
    debug,
    experimentName,
    lengthOfChain,
    missingSolutionPenalty,
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

  game.set('missingSolutionPenalty', missingSolutionPenalty);
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
};

export default gameInit;
