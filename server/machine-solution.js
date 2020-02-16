export const MachineSolutions = new Mongo.Collection("machineSolutions");

const count = () => {
  return MachineSolutions.find({}).count();
};

const create = machineSolution => {
  return MachineSolutions.insert({
    ...machineSolution,
    createdAt: new Date()
  });
};

const deleteAll = () => {
  return MachineSolutions.remove({});
};

const load = (environmentId, modelName) => {
  const where = {
    environmentId,
    modelName
  };
  return MachineSolutions.findOne(where);
};

const loadById = _id => {
  return MachineSolutions.findOne({ _id });
};

MachineSolutions.count = count;
MachineSolutions.create = create;
MachineSolutions.deleteAll = deleteAll;
MachineSolutions.load = load;
MachineSolutions.loadById = loadById;
