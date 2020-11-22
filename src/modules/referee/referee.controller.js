import RefereeService from './referee.service';
import BadRequest from '../../utils/errors/bad-request';
import succesResponse from '../../utils/response';

const refereeService = RefereeService();

exports.create = async (req, res, next) => {
  try {
    const { _id, name } = req.body;
    if (!_id || !name) {
      throw new BadRequest('Id, name requeridos');
    }
    const referee = await refereeService.insert({
      _id,
      name,
    });
    return succesResponse(res, 'Arbitro creado', referee);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.get = async (req, res, next) => {
  try {
    const referees = await refereeService.get();
    return succesResponse(res, 'Arbitros disponibles', referees);
  } catch (err) {
    next(err);
    return null;
  }
};
