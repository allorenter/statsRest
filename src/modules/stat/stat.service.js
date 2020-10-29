import StatModel from './stat.model';

const StatService = () => {
  const insert = (stat) => new StatModel(stat).save();

  const get = async () => StatModel.find();

  return Object.freeze({
    insert,
    get,
  });
};

export default StatService;
