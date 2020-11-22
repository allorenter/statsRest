import express from 'express';
import refereeController from './referee.controller';

const router = express.Router();

router.post('/create', refereeController.create);

router.get('/get', refereeController.get);

export default router;
