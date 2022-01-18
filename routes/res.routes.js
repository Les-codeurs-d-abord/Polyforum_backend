module.exports = app => {
  const res = require("../controllers/res.controller.js");
  const router = require("express").Router();

  //return file 
  router.get("/:folder/:file", res.getFile);

  app.use('/api/res', router);
};
