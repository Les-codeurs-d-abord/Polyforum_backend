module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const router = require("express").Router();
  const auth = require("../middleware/auth");
  const checkRoleAndUserId = require("../middleware/checkRoleAndUserId");

  // Reset a User password if forgotten
  router.put("/resetForgottenPassword", users.resetForgottenPassword);

  // Update a User email
  router.put("/:userId", auth(["ADMIN"]), users.update);

  // Update a User password
  router.put(
    "/:userId/changePassword",
    checkRoleAndUserId(["ENTREPRISE", "CANDIDAT"]),
    users.changePassword
  );

  // Reset a User password
  router.put("/:userId/resetPassword", auth(["ADMIN"]), users.resetPassword);

  // Send reminder mails to candidates
  router.post(
    "/sendRemindersCandidates",
    auth(["ADMIN"]),
    users.sendRemindersCandidates
  );

  // Send reminder mails to companies
  router.post(
    "/sendRemindersCompanies",
    auth(["ADMIN"]),
    users.sendRemindersCompanies
  );

  // Send satisfaction survey to candidates and companies
  router.post(
    "/sendSatisfactionSurvey",
    auth(["ADMIN"]),
    users.sendSatisfactionSurvey
  );

  app.use("/api/users", router);
};
