module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  const router = require("express").Router();

  // Update a User email
  router.put("/:userId", users.update);

  app.use("/api/users", router);
};
