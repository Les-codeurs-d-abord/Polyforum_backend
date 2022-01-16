module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  const cors = require("../middleware/cors");
  const router = require("express").Router();

  // Update a User email
  router.put("/:userId", cors, users.update);

  // Update a User password
  router.put("/:userId/changePassword", cors, users.changePassword);

  // Update a User password
  router.put("/:userId/resetPassword", cors, users.resetPassword);

  // Get all admins
  router.get("/admins", cors, users.findAdmins);

  // Get a user
  router.get("/:userId", cors, users.findById);

  // Create an admin
  router.post("/admins", cors, users.createAdmin);

  app.use("/api/users", router);
};
