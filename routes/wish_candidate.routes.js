module.exports = (app) => {
    const wishController = require("../controllers/wish_candidate.controller.js");
    const router = require("express").Router();
    const checkCandidateId = require("../middleware/checkCandidateId.js");

    // Update the wishes' ranks of a candidate
    router.put("/:candidateProfileId", checkCandidateId, wishController.update);

    // Check if a wish already exists
    router.get("/check/:candidateProfileId/:offerId", checkCandidateId, wishController.checkByCandidateIdAndOfferId);

    // Get all the wishes from an candidateId
    router.get("/:candidateProfileId", checkCandidateId, wishController.findAllByCandidateId);

    // Add a wish to a candidate
    router.post("/:candidateProfileId/:offerId", checkCandidateId, wishController.createWishCandidate);

    // Delete a single wish with id
    router.delete("/:candidateProfileId/:offerId", checkCandidateId, wishController.delete);

    app.use("/api/wishcandidate", router);
};