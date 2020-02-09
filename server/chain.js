import { Solutions } from "./solution";

export const Chains = new Mongo.Collection("chains");

/*
 * Chain Schema
 * {
 *   experimentName: string;
 *   hasRobotSolution: boolean;
 *   lengthOfChain: number;
 *   lockedByPlayerId: string;
 *   numberOfValidSolutions: number;
 *   positionOfRobotSolution: boolean;
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

const loadAllAvailableChainsForPlayer = playerId => {
  const playerSolutions = Solutions.loadForPlayer(playerId);
  const playerSoltutionChainIds = playerSolutions.map(
    solution => solution.chainId
  );
  const playerSolutionNetworkIds = playerSolutions.map(
    solution => solution.networkId
  )

  return chains = Chains.find(
    {
      _id: { $nin: playerSoltutionChainIds },
      networkId: { $nin: playerSolutionNetworkIds },
      lockedByPlayerId: null, // the chain is not locked
      $expr: { $ne: [ "lengthOfChain", "numberOfValidSolutions" ] } // the chain is not complete
    },
    {
      sort: {
        numberOfValidSolutions: 1
      }
    }
  ).fetch();
};

/**
 *
 * @returns {chain | null}
 */
const loadNextChainForPlayer = playerId => {
  const availableChains = loadAllAvailableChainsForPlayer(playerId);
  let chain;
  for (const availableChain of availableChains) {
    chain = Chains.lockChainForPlayer(availableChain._id, playerId);
    if (chain) {
      break;
    }
  }
  return chain;
};

const loadAll = experimentName => {
  const where = {};
  if (experimentName) {
    where.experimentName = experimentName;
  }
  return Chains.find(where).fetch();
};

/**
  * A player must obtain a lock on a chain in order to play that chain/environment
  *
  * @returns {chain | null}
  */
const lockChainForPlayer = (chainId, playerId) => {
  return Chains.findAndModify({
    query: { _id: chainId, lockedByPlayerId: null },
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
