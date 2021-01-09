import express from 'express';
import TeamController from './team.controller';

const router = express.Router();

router.post('/create', TeamController.create);

router.get('/get', TeamController.get);

router.get('/get-by-season-competition/:season/:competition', TeamController.getBySeasonCompetition);

router.get('/get-avg-stats-teams/:season/:competition/:stat', TeamController.getAvgStat);

export default router;
