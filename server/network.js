
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

const loadAll = experimentName => {
  const where = {};
  if (experimentName) {
    where.experimentName = experimentName;
  }
  return Networks.find(where).fetch();
};

const loadById = _id => {
  return Networks.findOne({ _id });
};

const loadPracticeNetworks = () => {
  return Networks.find({ experimentName: "practice" });
};

Networks.count = count;
Networks.create = create;
Networks.deleteAll = deleteAll;
Networks.loadAll = loadAll;
Networks.loadById = loadById;
Networks.loadPracticeNetworks = loadPracticeNetworks;
