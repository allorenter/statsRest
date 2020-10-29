import CompetitionService from './competition.service';
import { BadRequest } from '../../utils/errors';
import succesResponse from '../../utils/response';

const competitionService = CompetitionService();

exports.create = async (req, res, next) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      throw new BadRequest('Id y nombre requeridos');
    }
    const competition = await competitionService.insert({ _id: id.toUpperCase(), name });
    return succesResponse(res, 'Competicion creada', competition);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.get = async (req, res, next) => {
  try {
    const competitions = await competitionService.get();
    return succesResponse(res, 'Competiciones disponibles', competitions);
  } catch (err) {
    next(err);
    return null;
  }
};
