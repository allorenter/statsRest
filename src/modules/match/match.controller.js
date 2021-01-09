import MatchService from './match.service';
import succesResponse from '../../utils/response';
import BadRequest from '../../utils/errors/bad-request';
import { isValidSeason } from '../../utils/functions';

const matchService = MatchService();

exports.get = async (req, res, next) => {
  try {
    const matches = await matchService.get();
    return succesResponse(res, 'Partidos', matches);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.getByCompetition = async (req, res, next) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      throw new BadRequest('Id de la competicion requerido');
    }
    const matches = await matchService.getByCompetition(_id);
    return succesResponse(res, 'Partidos', matches);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.getBySeason = async (req, res, next) => {
  try {
    const { season } = req.params;
    if (!isValidSeason(season)) {
      throw new BadRequest('Season incorrecta');
    }
    const matches = await matchService.getBySeason(season);
    return succesResponse(res, 'Partidos', matches);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.getBySeasonCompetition = async (req, res, next) => {
  try {
    const { season, competition } = req.params;
    if (!isValidSeason(season) && !competition) {
      throw new BadRequest('Id y temporada de la competicion requerido');
    }
    const matches = await matchService.getBySeasonCompetition(season, competition);
    return succesResponse(res, 'Partidos', matches);
  } catch (err) {
    next(err);
    return null;
  }
};
