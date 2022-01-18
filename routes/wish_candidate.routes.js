module.exports = (app) => {

    const wishController = require("../controllers/wish_candidate.controller.js");

    const cors = require("../middleware/cors");
    const router = require("express").Router();

    // Update the rank of a wish
    router.put("/:wishId", cors, wishController.update);

    // Get all the wishes from an candidateId
    router.get("/:candidateId", cors, wishController.findAllByCandidateId);

    // Create a wish
    router.post("", cors, wishController.createWishCandidate);

    // Delete a single wish with id
    router.delete("/:wishId", cors, wishController.deleteById);

    app.use("/api/wishcandidate", router);
};