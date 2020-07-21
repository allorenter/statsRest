import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config';

const app = express();

//archivos de rutas
import testRouter from "./components/test/test.routes";
import downloadRouter from "./components/download/download.routes";

//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

app.use("/api/test", testRouter);
app.use("/api/download-matches", downloadRouter);

//prueba de conexión a la base de datos
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	console.log("Conectado a %s", MONGODB_URL);
	console.log("Press CTRL + C to stop the process. \n");	
})
.catch(err => {
	console.error("App starting error:", err.message);
	process.exit(1);
});



export default app;
