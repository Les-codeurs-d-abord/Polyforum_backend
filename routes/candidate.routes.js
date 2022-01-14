module.exports = (app) => {
  const candidateController = require("../controllers/candidate.controller.js");

  const router = require("express").Router();
  const cors = require("../middleware/cors");

  // Create a new candidate User
  router.post("/", cors, candidateController.createCandidate);

  // Retrieve all candidates
  router.get("/", cors, candidateController.candidateList);

  // Retrieve a single candidate with id
  router.get("/:userId", cors, candidateController.findById);

  // Delete a single candidate with id
  router.delete("/:userId", cors, candidateController.deleteById);

  // Update a candidate profile with id
  router.put("/:userId", cors, candidateController.updateCandidateProfile);

  // Add a candidate link
  router.post("/:userId/links", cors, candidateController.addLink);

  // Get all the links of a candidate
  router.get("/:userId/links", cors, candidateController.linksList);

  // Delete a candidate link with id
  router.delete("/links/:linkId", cors, candidateController.deleteLinkById);

  // Add a candidate tag
  router.post("/:userId/tags", cors, candidateController.addTag);

  // Get all the tags of a candidate
  router.get("/:userId/tags", cors, candidateController.tagsList);

  // Delete a candidate tag with id
  router.delete("/tags/:candidateTagId", cors, candidateController.deleteTagById);

  app.use("/api/candidates", router);
};
