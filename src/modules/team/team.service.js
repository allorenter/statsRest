import { union, find, map } from 'lodash';
import TeamModel from './team.model';
import MatchModel from '../match/match.model';
import { getFilterSeasonCompetition } from '../../utils/functions';
import StatService from '../stat/stat.service';

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

  const getAvgStat = async (season, competition, stat) => {
    const getFilter = (type, seasonCompetitionFilter, formatedStat) => [
      { $match: seasonCompetitionFilter },
      {
        $group: {
          _id: type === 'home' ? '$hometeam' : '$awayteam',
          for: { $avg: `$${type === 'home' ? formatedStat.home : formatedStat.away}` },
          against: { $avg: `$${type === 'home' ? formatedStat.away : formatedStat.home}` },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];
    const statService = StatService();
    const homeFilter = getFilter('home', getFilterSeasonCompetition(season, competition), statService.formatStat(stat));
    const awayFilter = getFilter('away', getFilterSeasonCompetition(season, competition), statService.formatStat(stat));
    const home = await MatchModel.aggregate(homeFilter);
    const away = await MatchModel.aggregate(awayFilter);
    return map(home, (teamDataHome) => {
      const teamDataAway = find(away, { _id: teamDataHome._id });
      return {
        teamId: teamDataHome._id,
        teamName: teamDataHome._id,
        homeMatches: { for: teamDataHome.for, against: teamDataHome.against, total: teamDataHome.for + teamDataHome.against },
        awayMatches: { for: teamDataAway.for, against: teamDataAway.against, total: teamDataAway.for + teamDataAway.against },
        allMatches: {
          for: (teamDataHome.for + teamDataAway.for) / 2,
          against: (teamDataHome.against + teamDataAway.against) / 2,
          total: ((teamDataHome.for + teamDataAway.for) / 2) + ((teamDataHome.against + teamDataAway.against) / 2),
        },
      };
    });
  };

  return Object.freeze({
    insert,
    get,
    getBySeasonCompetition,
    getAvgStat,
  });
};

export default TeamService;
