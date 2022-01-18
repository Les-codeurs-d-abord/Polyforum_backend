module.exports = (app) => {

    const wishController = require("../controllers/wish_candidate.controller.js");

    const cors = require("../middleware/cors");
    const router = require("express").Router();

    // Update the wishes' ranks of a candidate
    router.put("/:candidateId", wishController.update);

    // Get all the wishes from an candidateId
    router.get("/:candidateId", wishController.findAllByCandidateId);

    // Add a wish to a candidate
    router.post("", wishController.createWishCandidate);

    // Delete a single wish with id
    router.delete("/:wishId", wishController.deleteById);

    app.use("/api/wishcandidate", router);
};