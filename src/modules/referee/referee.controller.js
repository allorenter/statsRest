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

exports.getByCompetition = async (req, res, next) => {
  try {
    const { competition } = req.params;
    if (!competition) {
      throw new BadRequest('Competición requerida');
    }
    return succesResponse(res, 'Arbitros de la competición', await refereeService.getByCompetition(competition));
  } catch (err) {
    next(err);
    return null;
  }
};

exports.getBySeasonCompetition = async (req, res, next) => {
  try {
    // VALIDARLO BIEN
    const competition = req.body.competition || 'E0';
    const seasons = ['2021'];
    return succesResponse(res, 'Arbitros de la competicion', await refereeService.getBySeasonsCompetition(seasons, competition));
  } catch (err) {
    next(err);
    return null;
  }
};
