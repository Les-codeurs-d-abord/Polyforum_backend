module.exports = app => {
    const planning = require("../controllers/planning.controller.js");
    const router = require("express").Router();

    router.post("", planning.generationPlanning);

    router.get("/:userId", planning.findByUserId);

    router.get('/candidate/:candidateProfileId', planning.findByCandidateId);

    router.get('/company/:companyProfileId', planning.findByCompanyId);

    router.get('/freecompanies/:period', planning.findFreeCompaniesAtGivenPeriod);

    router.get('/freecandidates/:period', planning.findFreeCandidatesAtGivenPeriod);

    router.post("/meeting", planning.addMeeting);

    router.delete("/slot", planning.deleteSlot);

    app.use('/api/planning', router);
  };
  