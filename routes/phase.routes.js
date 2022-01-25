module.exports = app => {
  const phase = require("../controllers/phase.controller.js");
  const router = require("express").Router();

  router.post("/setInscription", phase.setInscriptionPhase);
  router.post("/setWish", phase.setWishPhase);
  router.post("/setPlanning", phase.setPlanningPhase);
  router.get("", phase.getCurrentPhase);

  app.use('/api/phase', router);
};
