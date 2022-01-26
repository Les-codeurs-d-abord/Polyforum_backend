module.exports = (app) => {

    const wishController = require("../controllers/wish_company.controller");

    const router = require("express").Router();

    // Update the rank of a wish
    router.put("/:companyProfileId", wishController.update);

    // Get all the wishes from a companyId
    router.get("/:companyProfileId", wishController.findAllByCompanyId);

    // Add a wish to a company
    router.post("", wishController.createWishCompany);

    // Delete a single wish with id
    router.delete("", wishController.delete);

    app.use("/api/wishcompany", router);
};