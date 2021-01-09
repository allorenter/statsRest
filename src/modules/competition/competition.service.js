import CompetitionModel from './competition.model';

const CompetitionService = () => {
  const insert = (competition) => new CompetitionModel(competition).save();

  const get = async () => CompetitionModel.find();

  const deleteCompetition = async (_id) => CompetitionModel.deleteOne({ _id });

  const getIds = async () => {
    const competitions = await CompetitionModel.find({}, '_id');
    return competitions.map((i) => i._id);
  };

  return Object.freeze({
    insert,
    get,
    getIds,
    deleteCompetition,
  });
};

export default CompetitionService;
