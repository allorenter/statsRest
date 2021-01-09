import express from 'express';
import StatController from './stat.controller';

const router = express.Router();

router.post('/create', StatController.create);

router.get('/get', StatController.get);

export default router;
