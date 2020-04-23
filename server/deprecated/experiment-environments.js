export const ExperimentEnvironments = new Mongo.Collection('experimentEnvironments');

const count = () => {
  return ExperimentEnvironments.find({}).count();
};

const create = experimentEnvironment => {
  return ExperimentEnvironments.insert({
    ...experimentEnvironment,
    createdAt: new Date(),
  });
};

const deleteAll = () => {
  return ExperimentEnvironments.remove({});
};

const loadAll = experimentName => {
  const where = {};
  if (experimentName) {
    where.experimentName = experimentName;
  }
  return ExperimentEnvironments.find(where).fetch();
};

const loadById = _id => {
  return ExperimentEnvironments.findOne({ _id });
};

const loadPracticeExperimentEnvironments = () => {
  return ExperimentEnvironments.find({ experimentName: 'practice' }).fetch();
};

ExperimentEnvironments.count = count;
ExperimentEnvironments.create = create;
ExperimentEnvironments.deleteAll = deleteAll;
ExperimentEnvironments.loadAll = loadAll;
ExperimentEnvironments.loadById = loadById;
ExperimentEnvironments.loadPracticeExperimentEnvironments = loadPracticeExperimentEnvironments;
