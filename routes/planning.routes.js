module.exports = app => {
    const planning = require("../controllers/planning.controller.js");
    const router = require("express").Router();
    const cors = require("../middleware/cors");

    router.post("", planning.generationPlanning);

    router.get("/:userId", cors, planning.findByUserId);

    router.get('/candidate/:candidateId', cors, planning.findByCandidateId);

    router.get('/company/:companyId', cors, planning.findByCompanyId);

    router.get('/freecompanies/:period', cors, planning.findFreeCompaniesAtGivenPeriod);

    app.use('/api/planning', router);
  };
  