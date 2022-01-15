module.exports = (app) => {

    const wishController = require("../controllers/wish_company.controller");

    const cors = require("../middleware/cors");
    const router = require("express").Router();

    // Update the rank of a wish
    router.put("/:wishId", cors, wishController.update);

    // Get all the wishes from a companyId
    router.get("/:companyId", cors, wishController.findAllByCompanyId);

    // Create a wish
    router.post("", cors, wishController.createWishCompany);

    // Delete a single wish with id
    router.delete("/:wishId", cors, wishController.deleteById);

    app.use("/api/wishcompany", router);
};