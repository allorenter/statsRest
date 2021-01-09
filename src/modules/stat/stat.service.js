import StatModel from './stat.model';

const StatService = () => {
  const insert = (stat) => new StatModel(stat).save();

  const get = async () => StatModel.find();

  const getByTypes = async () => StatModel.find({ type: 'match_statistics' });

  const formatStat = (stat) => {
    if (stat === 'ftg' || stat === 'htg') {
      return {
        home: `${stat.charAt(0) + stat.charAt(1)}h${stat.charAt(2)}`,
        away: `${stat.charAt(0) + stat.charAt(1)}a${stat.charAt(2)}`,
      };
    }
    return {
      home: `h${stat}`,
      away: `a${stat}`,
    };
  };

  return Object.freeze({
    insert,
    get,
    getByTypes,
    formatStat,
  });
};

export default StatService;
