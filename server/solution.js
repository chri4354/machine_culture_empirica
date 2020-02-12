export const Solutions = new Mongo.Collection("solutions");

/*
 * Solution Schema
 *
 * {
 *   chainId: string;
 *   environmentId: string;
 *   experimentName: string;
 *   experimentEnvironmentId: string;
 *   isValid: boolean;
 *   batchId: string;
 *   treatment: Object;
 *   experimentApplicationVersion: string;
 *   playerId: string;
 *   actions: any[];
 *   ...
 * }
 *
 */

const count = () => {
  return Solutions.find({}).count();
};

const create = solution => {
  return Solutions.insert({
    ...solution,
    createdAt: new Date()
  });
};

const deleteAll = () => {
  return Solutions.remove({});
};

const loadAll = chainId => {
  const where = {};
  if (chainId) {
    where.chainId = chainId;
  }
  return Solutions.find(chainId).fetch();
};

const loadForPlayer = playerId => {
  return Solutions.find({ playerId }).fetch();
};

const loadValidSolutionsForChain = chainId => {
  return Solutions.find(
    { chainId, isValid: true },
    { sort: { createdAt: 1 } }
  ).fetch();
};

Solutions.count = count;
Solutions.create = create;
Solutions.deleteAll = deleteAll;
Solutions.loadAll = loadAll;
Solutions.loadValidSolutionsForChain = loadValidSolutionsForChain;
Solutions.loadForPlayer = loadForPlayer;
