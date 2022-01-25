module.exports = app => {
    const planning = require("../controllers/planning.controller.js");
    const router = require("express").Router();

    router.post("", planning.generationPlanning);

    router.get("/:userId", planning.findByUserId);

    router.get('/candidate/:candidateProfileId', planning.findByCandidateId);

    router.get('/company/:companyProfileId', planning.findByCompanyId);

    app.use('/api/planning', router);
  };
  