module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  const router = require("express").Router();
  const cors = require("../middleware/cors");

  // Create a new candidate User
  router.post("/candidates", cors, users.createCandidate);

  // Retrieve all candidates
  router.get("/candidateList", users.candidateList);

  // Update a User email
  router.put("/:userId", users.update);

  app.use("/api/users", router);
};
