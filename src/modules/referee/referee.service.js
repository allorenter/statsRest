import RefereeModel from './referee.model';
import MatchModel from '../match/match.model';

const RefereeService = () => {
  const insert = (stat) => new RefereeModel(stat).save();

  const get = async () => RefereeModel.find();

  const getStatsBySeasonCompetition = async (season, competition) => {

  };

  return Object.freeze({
    insert,
    get,
  });
};

export default RefereeService;
