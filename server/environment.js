export const Environments = new Mongo.Collection("environments");

const count = () => {
  return Environments.find({}).count();
};

const loadAll = () => {
  return Environments.find({}).fetch();
};

const deleteAll = () => {
  return Environments.remove({});
};

Environments.count = count;
Environments.deleteAll = deleteAll;
Environments.loadAll = loadAll;
