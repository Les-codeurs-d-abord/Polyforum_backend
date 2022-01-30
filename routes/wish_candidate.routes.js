module.exports = (app) => {
    const wishController = require("../controllers/wish_candidate.controller.js");
    const router = require("express").Router();

    // Update the wishes' ranks of a candidate
    router.put("/:candidateProfileId", wishController.update);

    // Check if a wish already exists
    router.get("/check/:candidateProfileId/:offerId", wishController.checkByCandidateIdAndOfferId);

    // Get all the wishes from an candidateId
    router.get("/:candidateProfileId", wishController.findAllByCandidateId);

    // Add a wish to a candidate
    router.post("/:candidateProfileId/:offerId", wishController.createWishCandidate);

    // Delete a single wish with id
    router.delete("/:candidateProfileId/:offerId", wishController.delete);

    app.use("/api/wishcandidate", router);
};