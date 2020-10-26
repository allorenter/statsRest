import express from 'express';
import CompetitionController from './competition.controller';

const router = express.Router();

router.post('/create', CompetitionController.create);

router.get('/get', CompetitionController.get);

export default router;
