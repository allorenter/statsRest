import express from "express";
import TeamController from "./team.controller";

var router = express.Router();

router.get("/prueba", function(req, res, next) {
    res.json({pppp: "pppp"});
});

router.post("/create", TeamController.create);

router.get("/get", TeamController.get);


export default router;