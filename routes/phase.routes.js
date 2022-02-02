module.exports = (app) => {
  const phase = require("../controllers/phase.controller.js");
  const router = require("express").Router();
  const auth = require("../middleware/auth");

  router.post("/setInscription", auth(["ADMIN"]), phase.setInscriptionPhase);
  router.post("/setWish", auth(["ADMIN"]), phase.setWishPhase);
  router.post("/setPlanning", auth(["ADMIN"]), phase.setPlanningPhase);
  router.get("", auth(["*"]), phase.getCurrentPhase);

  app.use("/api/phase", router);
};
