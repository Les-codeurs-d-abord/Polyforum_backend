module.exports = (app) => {

    const wishController = require("../controllers/wish_company.controller");

    const router = require("express").Router();

    // Update the rank of a wish
    router.put("/:companyProfileId", wishController.update);

    // Check if a wish already exists
    router.get("/check/:companyProfileId/:candidateProfileId", wishController.checkByCandidateIdAndCompanyId);

    // Get all the wishes from a companyId
    router.get("/:companyProfileId", wishController.findAllByCompanyId);

    // Add a wish to a company
    router.post("/:companyProfileId/:candidateProfileId", wishController.createWishCompany);

    // Delete a single wish with id
    router.delete("/:companyProfileId/:candidateProfileId", wishController.delete);

    app.use("/api/wishcompany", router);
};