import express from "express";
import DownloadController from "./download.controller";

var router = express.Router();

router.post("/download", DownloadController.executeDownload);

router.get("/last-download", DownloadController.getLastDownload);

export default router;
