import CompetitionService from './competition.service';
import BadRequest from '../../utils/errors/bad-request';
import succesResponse from '../../utils/response';

const competitionService = CompetitionService();

exports.create = async (req, res, next) => {
  try {
    const { _id, name } = req.body;
    if (!_id || !name) {
      throw new BadRequest('_id y name requeridos');
    }
    const competition = await competitionService.insert({ _id: _id.toUpperCase(), name });
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

exports.deleteCompetition = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const deleted = await competitionService.deleteCompetition(_id);
    return succesResponse(res, 'Competición eliminada', deleted);
  } catch (err) {
    next(err);
    return null;
  }
};
