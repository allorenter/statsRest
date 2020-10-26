import express from 'express';
import StatController from './stat.controller';

const router = express.Router();

router.get('/prueba', (req, res, next) => {
  res.json({ pppp: 'pppp' });
});

router.post('/create', StatController.create);

router.get('/get', StatController.get);

export default router;
