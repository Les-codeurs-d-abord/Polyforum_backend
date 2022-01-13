module.exports = app => {
    const planning = require("../controllers/planning.controller.js");
    const router = require("express").Router();
    const cors = require("../middleware/cors");

    router.post("", planning.generationPlanning);
  
    app.use('/api/planning', router);
  };
  