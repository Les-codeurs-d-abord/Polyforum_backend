module.exports = app => {
  const res = require("../controllers/res.controller.js");
  const router = require("express").Router();
  const cors = require("../middleware/cors");

  //return file 
  router.get("/:folder/:file", cors, res.getFile);

  app.use('/api/res', router);
};
