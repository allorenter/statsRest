import express from "express";

var router = express.Router();

router.get("/prueba", async function (req, res, next) {  
  res.send({prueba: "pppppp"});
});

export default router;
