import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import cron from "cron";
import "dotenv/config";
import DownloadService from "./modules/download/download.service";
import handleErrors from "./middleware/handleErrors"

const app = express();

//archivos de rutas
import downloadRouter from "./modules/download/download.routes";
import competitionRouter from "./modules/competition/competition.routes";

//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use("/api/download-matches", downloadRouter);
app.use("/api/competition", competitionRouter);
app.use(handleErrors);

//prueba de conexión a la base de datos
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
	console.log("Conectado a %s", MONGODB_URL);
	console.log("Press CTRL + C to stop the process. \n");	
})
.catch(err => {
	console.error("App starting error:", err.message);
	process.exit(1);
});

//tarea que descarga partidos del servidor todos los días a las 00:00
const CronJob = cron.CronJob;
const downloadJob = new CronJob('00 00 00 * * *', function() {
	console.log("EJECUTADA TAREA PROGRAMADA");
	const downloadService = DownloadService();
    downloadService.executeDownload();
});
downloadJob.start();


export default app;
