import express from "express";
import StatController from "./stat.controller";

var router = express.Router();

router.get("/prueba", function(req, res, next) {
    res.json({pppp: "pppp"});
});

router.post("/create", StatController.create);

router.get("/get", StatController.get);


export default router;
