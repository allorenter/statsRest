import { union } from 'lodash';
import TeamModel from './team.model';
import MatchModel from '../match/match.model';
import { getFilterSeasonCompetition } from '../../utils/functions';

const TeamService = () => {
  const insert = (stat) => new TeamModel(stat).save();

  const get = async () => TeamModel.find();

  const getBySeasonCompetition = async (season, competition) => {
    const result = await MatchModel.aggregate([
      { $match: getFilterSeasonCompetition(season, competition) },
      {
        $group: {
          _id: null,
          hometeam: { $addToSet: '$hometeam' },
          awayteam: { $addToSet: '$awayteam' },
        },
      },
    ]);
    return union(result[0].hometeam, result[0].awayteam).sort();
  };

  return Object.freeze({
    insert,
    get,
    getBySeasonCompetition,
  });
};

export default TeamService;
