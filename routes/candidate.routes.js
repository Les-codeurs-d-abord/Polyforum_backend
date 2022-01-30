module.exports = (app) => {
  const candidateController = require("../controllers/candidate.controller.js");

  const router = require("express").Router();

  // Retrieve all candidates
  router.get("/", candidateController.candidateList);

  // Retrieve a single candidate with id
  router.get("/:userId", candidateController.findById);

  // Get all the links of a candidate
  router.get("/:userId/links", candidateController.linksList);

  // Get all the tags of a candidate
  router.get("/:userId/tags", candidateController.tagsList);

  // Create a new candidate User
  router.post("/", candidateController.createCandidate);

  // Upload a profile picture
  router.post("/:userId/uploadLogo", candidateController.uploadLogo);

  // Upload a profile picture
  router.post("/:userId/uploadCV", candidateController.uploadCV);

  var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty({ uploadDir: './data/img', maxFilesSize: '4000000' });

  router.post('/:userId/uploadCV2', multipartyMiddleware, function(req, res) {
    console.log(req.files);
    console.log(req.files['image'].path);
    res.status(200).send('OK');
  });

  //test
  // Upload a profile picture
  //  router.post("/:userId/uploadCV2", candidateController.uploadCV2);

  // Update a candidate profile with id
  router.put("/:userId", candidateController.updateCandidateProfile);

  // Delete a single candidate with id
  router.delete("/:userId", candidateController.deleteById);

  app.use("/api/candidates", router);
};
