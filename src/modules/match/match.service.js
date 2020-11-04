import { find, round, map } from 'lodash';
import MatchModel from './match.model';
import { getFilterSeasonCompetition, getDatesSeason } from '../../utils/functions';
import StatService from '../stat/stat.service';

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

  const getAvgStatTeams = async (season, competition, stat) => {
    const statService = StatService();
    const formatedStat = statService.formatStat(stat);
    const filter = getFilterSeasonCompetition(season, competition);
    const home = await MatchModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$hometeam',
          avgFor: { $avg: `$${formatedStat.home}` },
          avgAgainst: { $avg: `$${formatedStat.away}` },
        },
      },
    ]);
    const away = await MatchModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$awayteam',
          avgFor: { $avg: `$${formatedStat.away}` },
          avgAgainst: { $avg: `$${formatedStat.home}` },
        },
      },
    ]);
    return map(home, (i) => {
      const awayData = find(away, { _id: i._id });
      return {
        _id: i._id,
        home: {
          avgFor: round(i.avgFor, 3),
          avgAgainst: round(i.avgAgainst, 3),
          total: round((i.avgFor + i.avgAgainst), 3),
        },
        away: {
          avgFor: round(awayData.avgFor, 3),
          avgAgainst: round(awayData.avgAgainst, 3),
          total: round((awayData.avgFor + awayData.avgAgainst), 3),
        },
        total: {
          avgFor: round((i.avgFor + awayData.avgFor) / 2, 3),
          avgAgainst: round((i.avgAgainst + awayData.avgAgainst) / 2, 3),
          total: round((
            (i.avgFor + awayData.avgFor) / 2
            + (i.avgAgainst + awayData.avgAgainst) / 2),
          3),
        },
      };
    }).sort((a, b) => {
      if (a._id > b._id) {
        return 1;
      }
      if (a._id < b._id) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  };

  return Object.freeze({
    insertMatches,
    insertMatch,
    get,
    getByCompetition,
    getBySeason,
    getBySeasonCompetition,
    getAvgStatTeams,
  });
};

export default MatchService;
