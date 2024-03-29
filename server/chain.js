import { Solutions } from "./solution";

export const Chains = new Mongo.Collection("chains");

/*
 * Chain Schema
 * {
 *   batchId: string;
 *   experimentName: string;
 *   hasMachineSolution: boolean;
 *   lengthOfChain: number;
 *   lockedByPlayerId: string;
 *   numberOfValidSolutions: number;
 *   positionOfMachineSolution: number | null;
 *   randomNumberForSorting: number;
 *   startingSolutionModelName: string;
 *   ...
 * }
 */

const count = () => {
  return Chains.find({}).count();
};

const create = chain => {
  return Chains.insert({
    ...chain,
    lockedByPlayerId: null,
    numberOfValidSolutions: 0,
    createdAt: new Date()
  });
};

const deleteAll = () => {
  return Chains.remove({});
};

/**
 *
 * @returns {chain | null}
 */
const loadNextChainForPlayer = (playerId, batchId) => {
  const playerSolutions = Solutions.loadForPlayer(playerId);
  const playerSoltutionChainIds = playerSolutions.map(
    solution => solution.chainId
  );
  const playerSolutionEnvironmentIds = playerSolutions.map(
    solution => solution.environmentId
  );
  const chain = Chains.lockChainForPlayer(
    playerId,
    playerSoltutionChainIds,
    playerSolutionEnvironmentIds,
    batchId
  );
  return chain;
};

const loadAll = experimentName => {
  const where = {};
  if (experimentName) {
    where.experimentName = experimentName;
  }
  return Chains.find(where).fetch();
};

const updateRandomNumbersForSorting = () => {
  return Chains.find({}).forEach(function(chain) {
    Chains.update(
      { _id: chain._id },
      { $set: { randomNumberForSorting: Math.random() } }
    );
  });
};

/**
 *
 * @returns {chain | null}
 */
const loadRandomChain = batchId => {
  return Chains.findOne(
    {
      batchId
    },
    {
      sort: {
        randomNumberForSorting: 1 // selects a random chain
      }
    }
  );
};

/**
 * A player must obtain a lock on a chain in order to play that chain/environment
 *
 * @returns {chain | null}
 */
const lockChainForPlayer = (
  playerId,
  playerSolutionChainIds,
  playerSolutionEnvironmentIds,
  batchId
) => {
  // findAndModify updates one document
  return Chains.findAndModify({
    query: {
      _id: { $nin: playerSolutionChainIds },
      batchId,
      environmentId: { $nin: playerSolutionEnvironmentIds },
      $expr: { $gt: ["$lengthOfChain", "$numberOfValidSolutions"] }, // the chain is not complete
      lockedByPlayerId: null
    },
    sort: {
      // numberOfValidSolutions: 1,
      randomNumberForSorting: 1 // selects a random chain
    },
    update: { $set: { lockedByPlayerId: playerId } },
    new: true
  });
};

const updateChainAfterRound = (chainId, playerId, numberOfValidSolutions) => {
  return Chains.findAndModify({
    query: { _id: chainId, lockedByPlayerId: playerId },
    update: {
      $set: {
        numberOfValidSolutions,
        lockedByPlayerId: null // release the lock
      }
    }
  });
};

const incrementNumberOfValidSolutions = chainId => {
  return Chains.update(
    { _id: chainId },
    { $inc: { numberOfValidSolutions: 1 } }
  );
};

const loadById = _id => {
  return Chains.findOne({ _id });
};

Chains.count = count;
Chains.create = create;
Chains.deleteAll = deleteAll;
Chains.incrementNumberOfValidSolutions = incrementNumberOfValidSolutions;
Chains.loadAll = loadAll;
Chains.loadById = loadById;
Chains.loadNextChainForPlayer = loadNextChainForPlayer;
Chains.lockChainForPlayer = lockChainForPlayer;
Chains.loadRandomChain = loadRandomChain;
Chains.updateChainAfterRound = updateChainAfterRound;
Chains.updateRandomNumbersForSorting = updateRandomNumbersForSorting;
