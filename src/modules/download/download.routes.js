import express from "express";
import DownloadController from "./download.controller";

var router = express.Router();

router.post("/download", DownloadController.executeDownload);

export default router;
