module.exports = (app) => {
  const candidateController = require("../controllers/candidate.controller.js");

  const router = require("express").Router();
  const cors = require("../middleware/cors");

  // Retrieve all candidates
  router.get("/", cors, candidateController.candidateList);

  // Retrieve a single candidate with id
  router.get("/:userId", cors, candidateController.findById);

  // Get all the links of a candidate
  router.get("/:userId/links", cors, candidateController.linksList);

  // Get all the tags of a candidate
  router.get("/:userId/tags", cors, candidateController.tagsList);

  // Create a new candidate User
  router.post("/", cors, candidateController.createCandidate);

  // Upload a profile picture
  router.post("/:userId/uploadLogo", cors, candidateController.uploadLogo);

  // Upload a profile picture
  router.post("/:userId/uploadCV", cors, candidateController.uploadCV);

  // Update a candidate profile with id
  router.put("/:userId", cors, candidateController.updateCandidateProfile);

  // Delete a single candidate with id
  router.delete("/:userId", cors, candidateController.deleteById);

  app.use("/api/candidates", router);
};
