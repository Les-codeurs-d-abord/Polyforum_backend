module.exports = app => {
  const debug = require("../controllers/debug.controller.js");

  const router = require("express").Router();

  router.post("/offer", debug.create);

  app.use('/api/debug', router);
};
