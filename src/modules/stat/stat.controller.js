import StatService from './stat.service';
import BadRequest from '../../utils/errors/bad-request';
import succesResponse from '../../utils/response';

const statService = StatService();

exports.create = async (req, res, next) => {
  try {
    const { _id, name, type } = req.body;
    if (!_id || !name || !type) {
      throw new BadRequest('Id, name y type requeridos');
    }
    const stat = await statService.insert({
      _id,
      name,
      type,
    });
    return succesResponse(res, 'Estadística creada', stat);
  } catch (err) {
    next(err);
    return null;
  }
};

exports.get = async (req, res, next) => {
  try {
    const stats = await statService.get();
    return succesResponse(res, 'Estadísticas disponibles', stats);
  } catch (err) {
    next(err);
    return null;
  }
};
