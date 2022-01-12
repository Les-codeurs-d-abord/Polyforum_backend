module.exports = app => {
  const tag = require("../controllers/tag.controller.js");
  const router = require("express").Router();
  const cors = require("../middleware/cors");

  router.post("", cors, tag.createTag);
  router.get("/:id", cors, tag.findTagById);
  router.get("", cors, tag.findAllTags);

  app.use('/api/tag', router);
};
