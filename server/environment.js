export const Environments = new Mongo.Collection("environments");

const count = () => {
  return Environments.find({}).count();
};

const loadAll = () => {
  return Environments.find({}).fetch();
};

Environments.count = count;
Environments.loadAll = loadAll;
