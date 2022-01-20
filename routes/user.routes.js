module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  const router = require("express").Router();

  // Update a User email
  router.put("/:userId", users.update);

  // Update a User password
  router.put("/:userId/changePassword", users.changePassword);

  // Reset a User password
  router.put("/:userId/resetPassword", users.resetPassword);

  // Get all admins
  router.get("/admins", users.findAdmins);

  // Send reminder mails to candidates and companies
  router.get("/sendReminders", users.sendReminders);

  // Get a user
  router.get("/:userId", users.findById);

  // Create an admin
  router.post("/admins", users.createAdmin);

  app.use("/api/users", router);
};
