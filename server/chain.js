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
 *   planningStageDurationInSeconds: number;
 *   positionOfMachineSolution: number | null;
 *   randomNumberForSorting: number;
 *   responseStageDurationInSeconds: number;
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
  const playerSolutionNetworkIds = playerSolutions.map(
    solution => solution.networkId
  );
  const chain = Chains.lockChainForPlayer(
    playerId,
    playerSoltutionChainIds,
    playerSolutionNetworkIds,
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
 * A player must obtain a lock on a chain in order to play that chain/environment
 *
 * @returns {chain | null}
 */
const lockChainForPlayer = (
  playerId,
  playerSolutionChainIds,
  playerSolutionNetworkIds,
  batchId
) => {
  // findAndModify updates one document
  return Chains.findAndModify({
    query: {
      _id: { $nin: playerSolutionChainIds },
      batchId,
      networkId: { $nin: playerSolutionNetworkIds },
      $expr: { $ne: ["lengthOfChain", "numberOfValidSolutions"] }, // the chain is not complete
      lockedByPlayerId: null
    },
    sort: {
      numberOfValidSolutions: 1,
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

Chains.count = count;
Chains.create = create;
Chains.deleteAll = deleteAll;
Chains.loadAll = loadAll;
Chains.loadNextChainForPlayer = loadNextChainForPlayer;
Chains.lockChainForPlayer = lockChainForPlayer;
Chains.updateChainAfterRound = updateChainAfterRound;
Chains.updateRandomNumbersForSorting = updateRandomNumbersForSorting;
