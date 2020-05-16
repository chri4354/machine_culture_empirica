import './callbacks';
import { Solutions } from './solutions/solution';
import { Chains } from './chains/chain';
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
