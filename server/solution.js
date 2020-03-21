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
 *   isMachineSolution: boolean;
 *   previousSolutionId: string | null;
 *   ...
 * }
 *
 */

const count = () => {
  return Solutions.find({}).count();
};

const create = solution => {
  // console.log("Saving solution...", solution);
  return Solutions.insert({
    ...solution,
    createdAt: new Date(),
    experimentApplicationVersion: "2.0--2019-03-21"
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

const loadById = _id => {
  return Solutions.findOne({ _id });
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
Solutions.loadById = loadById;
Solutions.loadValidSolutionsForChain = loadValidSolutionsForChain;
Solutions.loadForPlayer = loadForPlayer;
