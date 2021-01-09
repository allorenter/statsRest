import express from 'express';
import refereeController from './referee.controller';

const router = express.Router();

router.post('/create', refereeController.create);

router.get('/get', refereeController.get);

router.get('/get-by-competition/:competition', refereeController.getByCompetition);

router.post('/get-by-seasons-competition', refereeController.getBySeasonCompetition);

export default router;
