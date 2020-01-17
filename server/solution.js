export const Solutions = new Mongo.Collection("solutions");

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

const loadAll = () => {
  return Solutions.find({}).fetch();
};

const loadForNetwork = networkId => {
  return Solutions.find({ networkId }, { sort: { createdAt: 1 } }).fetch();
};

Solutions.count = count;
Solutions.create = create;
Solutions.deleteAll = deleteAll;
Solutions.loadAll = loadAll;
Solutions.loadForNetwork = loadForNetwork;
