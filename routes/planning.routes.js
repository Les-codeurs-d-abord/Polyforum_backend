module.exports = app => {
  const planning = require("../controllers/planning.controller.js");
  const router = require("express").Router();

  router.post("", planning.generationPlanning);

  router.post('/freecompanies', planning.findFreeCompaniesAtGivenPeriod);

  router.post('/freecandidates', planning.findFreeCandidatesAtGivenPeriod);

  router.get("/:userId", planning.findByUserId);

  router.get('/candidate/:candidateProfileId', planning.findByCandidateId);

  router.get('/company/:companyProfileId', planning.findByCompanyId);

  router.post("/meeting", planning.addMeeting);

  router.delete("/slot", planning.deleteSlot);

  app.use('/api/planning', router);
};
