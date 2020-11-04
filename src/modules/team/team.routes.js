import express from 'express';
import TeamController from './team.controller';

const router = express.Router();

router.get('/prueba', (req, res) => {
  res.json({ pppp: 'pppp' });
});

router.post('/create', TeamController.create);

router.get('/get', TeamController.get);

router.get('/get-by-season-competition/:season/:competition', TeamController.getBySeasonCompetition);

export default router;
