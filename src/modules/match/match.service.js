import MatchModel from './match.model';
import { getFilterSeasonCompetition, getDatesSeason } from '../../utils/functions';

const MatchService = () => {
  const insertMatches = (arrMatches) => MatchModel.insertMany(arrMatches, { ordered: false });

  const insertMatch = (match) => new MatchModel(match).save();

  const get = async () => MatchModel.find({}, 'id');

  const getByCompetition = async (competition) => MatchModel.find({ Division: competition }, 'id');

  const getBySeason = async (season) => {
    const datesCompetition = getDatesSeason(season);
    const filter = {
      matchdate: {
        $gte: datesCompetition.initialDate,
        $lt: datesCompetition.finishDate,
      },
    };
    return MatchModel.find(filter);
  };

  const getBySeasonCompetition = async (season, competition) => (
    MatchModel.find(getFilterSeasonCompetition(season, competition))
  );

  return Object.freeze({
    insertMatches,
    insertMatch,
    get,
    getByCompetition,
    getBySeason,
    getBySeasonCompetition,
  });
};

export default MatchService;
