import TeamService from './team.service';
import { BadRequest } from '../../utils/errors';
import succesResponse from '../../utils/response';

const teamService = TeamService();

exports.create = async (req, res, next) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      throw new BadRequest('Id y name requeridos');
    }
    const team = await teamService.insert({
      _id: id,
      name,
    });
    return succesResponse(res, 'Equipo creado', team);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const teams = await teamService.get();
    return succesResponse(res, 'Equipos disponibles', teams);
  } catch (err) {
    next(err);
  }
};
