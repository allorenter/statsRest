import express from "express";
import CompetitionController from "./competition.controller";

var router = express.Router();

router.post("/create", CompetitionController.create);


export default router;
