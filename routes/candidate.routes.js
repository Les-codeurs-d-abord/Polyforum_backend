module.exports = (app) => {
  const candidateController = require("../controllers/candidate.controller.js");

  const router = require("express").Router();
  const cors = require("../middleware/cors");

  // Create a new candidate User
  router.post("/", cors, candidateController.createCandidate);

  // Retrieve all candidates
  router.get("/", candidateController.candidateList);

  // Retrieve a single candidate with id
  router.get("/:userId", candidateController.findById);

  // Delete a single candidate with id
  router.delete("/:userId", candidateController.deleteById);

  // Update a candidate profile with id
  router.put("/:userId", candidateController.updateCandidateProfile)

  app.use("/api/candidates", router);
};
