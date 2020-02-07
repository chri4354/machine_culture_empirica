import { Solutions } from "./solution";

export const Chains = new Mongo.Collection("chains");

/*
 * Chain Schema
 * {
 *   experimentName: string;
 *   hasRobotSolution: boolean;
 *   positionOfRobotSolution: boolean;
 *
 * }
 */

const count = () => {
  return Chains.find({}).count();
};

const create = chain => {
  return Chains.insert({
    ...chain,
    createdAt: new Date()
  });
};

const deleteAll = () => {
  return Chains.remove({});
};

const loadNextChainForPlayer = playerId => {
  // TODO ensure two players aren't playing the same chain at the same time
  const playerSolutions = Solutions.loadForPlayer(playerId);
  const playerSoltutionChainIds = playerSolutions.map(
    solution => solution.chainId
  );

  // TODO load the chain with the least number of solutions
  // TODO don't load a chain that is complete
  const chain = Chains.findOne({ _id: { $nin: playerSoltutionChainIds } });
  return chain;
};

const loadAll = experimentName => {
  const where = {};
  if (experimentName) {
    where.experimentName = experimentName;
  }
  return Chains.find(where).fetch();
};

Chains.count = count;
Chains.create = create;
Chains.deleteAll = deleteAll;
Chains.loadAll = loadAll;
Chains.loadNextChainForPlayer = loadNextChainForPlayer;
