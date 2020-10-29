import CompetitionModel from './competition.model';

const CompetitionService = () => {
  const insert = (competition) => new CompetitionModel(competition).save();

  const get = async () => CompetitionModel.find();

  const getIds = async () => {
    const competitions = await CompetitionModel.find({}, '_id');
    return competitions.map((i) => i._id);
  };

  return Object.freeze({
    insert,
    get,
    getIds,
  });
};

export default CompetitionService;
