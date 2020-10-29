import express from 'express';
import DownloadController from './download.controller';

const router = express.Router();

router.post('/download', DownloadController.executeDownload);

router.get('/last-download', DownloadController.getLastDownload);

router.get('/prueba', DownloadController.prueba);

export default router;
