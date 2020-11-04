import express from 'express';
import MatchController from './match.controller';

const router = express.Router();

router.get('/get', MatchController.get);

router.get('/get-by-competition/:id', MatchController.getByCompetition);

router.get('/get-by-season/:season', MatchController.getBySeason);

router.get('/get-by-season-competition/:season/:competition', MatchController.getBySeasonCompetition);

router.get('/get-avg-stats-teams/:season/:competition/:stat', MatchController.getAvgStatsTeams);

export default router;
