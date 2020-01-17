import { getRandomInteger } from "./utils";

export const Networks = new Mongo.Collection("networks");

const count = () => {
  return Networks.find({}).count();
};

const create = network => {
  return Networks.insert({
    ...network,
    createdAt: new Date()
  });
};

const deleteAll = () => {
  return Networks.remove({});
};

const loadAll = () => {
  return Networks.find({}).fetch();
};

const loadOne = playerId => {
  // TODO improve selection logic
  const networks = loadAll();
  // return networks[getRandomInteger(0, 10)];
  return networks[getRandomInteger(0, networks.length - 1)];
};

Networks.count = count;
Networks.create = create;
Networks.deleteAll = deleteAll;
Networks.loadAll = loadAll;
Networks.loadOne = loadOne;
