import TeamService from './team.service';
import BadRequest from '../../utils/errors/bad-request';
import succesResponse from '../../utils/response';
import { isValidSeason } from '../../utils/functions';

const teamService = TeamService();

exports.create = async (req, res, next) => {
  try {
    const { _id, name } = req.body;
    if (!_id || !name) {
      throw new BadRequest('Id y name requeridos');
    }
    const team = await teamService.insert({
      _id,
      name,
    });
    return succesResponse(res, 'Equipo creado', team);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.get = async (req, res, next) => {
  try {
    const teams = await teamService.get();
    return succesResponse(res, 'Equipos disponibles', teams);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.getBySeasonCompetition = async (req, res, next) => {
  try {
    const { season, competition } = req.params;
    if (!isValidSeason(season) && !competition) {
      throw new BadRequest('Competición y temporada requeridos');
    }
    const teams = await teamService.getBySeasonCompetition(season, competition);
    return succesResponse(res, 'Equipos disponibles', teams);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.getAvgStat = async (req, res, next) => {
  try {
    const { season, competition, stat } = req.params;
    if (!isValidSeason(season) || !competition || !stat) {
      throw new BadRequest('Campos requeridos incorrectos');
    }
    const result = await teamService.getAvgStat(season, competition, stat);
    return succesResponse(res, 'Competiciones disponibles', result);
  } catch (err) {
    next(err);
    return null;
  }
};
