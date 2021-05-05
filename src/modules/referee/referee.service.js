import { map } from 'lodash';
import RefereeModel from './referee.model';
import MatchModel from '../match/match.model';
import StatService from '../stat/stat.service';
import { getFilterSeasonsCompetition } from '../../utils/functions';

const RefereeService = () => {
  const insert = (stat) => new RefereeModel(stat).save();

  const get = async () => RefereeModel.find();

  const getByCompetition = async (competition) => MatchModel.distinct('referee', { competition });

  const getBySeasonsCompetition = async (seasons, competition) => {
    const filter = getFilterSeasonsCompetition(seasons, competition);
    const statService = StatService();
    const statYellows = statService.formatStat('y');
    const statRedCards = statService.formatStat('r');
    if (filter) {
      const referees = await MatchModel.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: '$referee',
            homeYellowCards: { $avg: `$${statYellows.home}` },
            awayYellowCards: { $avg: `$${statYellows.away}` },
            homeRedCards: { $avg: `$${statRedCards.home}` },
            awayRedCards: { $avg: `$${statRedCards.away}` },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
      if (referees.length > 0) {
        return map(referees, (referee) => ({
          refereeId: referee._id,
          refereeName: referee._id,
          yellowCards: {
            homeTeam: referee.homeYellowCards,
            awayTeam: referee.awayYellowCards,
            total: referee.homeYellowCards + referee.awayYellowCards,
          },
          redCards: {
            homeTeam: referee.homeRedCards,
            awayTeam: referee.awayRedCards,
            total: referee.homeRedCards + referee.awayRedCards,
          },
        })).filter((refereeData) => refereeData.refereeId !== null);
      }
    }
    return [];
  };

  return Object.freeze({
    insert,
    get,
    getByCompetition,
    getBySeasonsCompetition,
  });
};

export default RefereeService;
