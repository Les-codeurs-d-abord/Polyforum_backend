module.exports = (app) => {
    const wishController = require("../controllers/wish_company.controller");
    const router = require("express").Router();
    const checkCompanyId = require("../middleware/checkCompanyId.js");


    // Update the rank of a wish
    router.put("/:companyProfileId", checkCompanyId, wishController.update);

    // Check if a wish already exists
    router.get("/check/:companyProfileId/:candidateProfileId", checkCompanyId, wishController.checkByCandidateIdAndCompanyId);

    // Get all the wishes from a companyId
    router.get("/:companyProfileId", checkCompanyId, wishController.findAllByCompanyId);

    // Add a wish to a company
    router.post("/:companyProfileId/:candidateProfileId", checkCompanyId, wishController.createWishCompany);

    // Delete a single wish with id
    router.delete("/:companyProfileId/:candidateProfileId", checkCompanyId, wishController.delete);

    app.use("/api/wishcompany", router);
};