module.exports = (app) => {
  var multiparty = require("connect-multiparty");
  const candidateController = require("../controllers/candidate.controller.js");
  const auth = require("../middleware/auth");
  const checkRoleAndUserId = require("../middleware/checkRoleAndUserId");

  const router = require("express").Router();

  // Retrieve all candidates
  router.get(
    "/",
    auth(["ADMIN", "ENTREPRISE"]),
    candidateController.candidateList
  );

  // Retrieve a single candidate with id
  router.get(
    "/:userId",
    auth(["*"]),
    candidateController.findById
  );

  // Create a new candidate User
  router.post("/", auth(["ADMIN"]), candidateController.createCandidate);

  // Upload a profile picture
  multipartyLogoMiddleware = multiparty({
    uploadDir: "./data/candidateLogos",
    maxFilesSize: "4000000",
  });
  router.post(
    "/:userId/uploadLogo",
    checkRoleAndUserId(["CANDIDAT"]),
    multipartyLogoMiddleware,
    candidateController.uploadLogo
  );

  // Upload a CV
  multipartyCVMiddleware = multiparty({
    uploadDir: "./data/candidateCV",
    maxFilesSize: "4000000",
  });
  router.post(
    "/:userId/uploadCV",
    checkRoleAndUserId(["CANDIDAT"]),
    multipartyCVMiddleware,
    candidateController.uploadCV
  );

  // Update a candidate profile with id
  router.put(
    "/:userId",
    checkRoleAndUserId(["CANDIDAT"]),
    candidateController.updateCandidateProfile
  );

  // Delete a single candidate with id
  router.delete("/:userId", auth(["ADMIN"]), candidateController.deleteById);

  app.use("/api/candidates", router);
};
