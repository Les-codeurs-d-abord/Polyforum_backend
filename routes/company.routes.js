module.exports = (app) => {
  var multiparty = require("connect-multiparty");
  const companyController = require("../controllers/company.controller.js");

  const router = require("express").Router();

  // Retrieve all companies
  router.get("/", companyController.companyList);

  // Retrieve all company's offers with id
  router.get("/:userId/offer", companyController.findOffersById);

  // Retrieve a single company with id
  router.get("/:userId", companyController.findById);

  // Create a new company User
  router.post("/", companyController.createCompany);

  // Upload a profile picture
  multipartyLogoMiddleware = multiparty({
    uploadDir: "./data/companyLogos",
    maxFilesSize: "4000000",
  });
  router.post(
    "/:userId/uploadLogo",
    multipartyLogoMiddleware,
    companyController.uploadLogo
  );

  // Delete a single company with id
  router.delete("/:userId", companyController.deleteById);

  // Update a company profile with id
  router.put("/:userId", companyController.updateCompanyProfile);

  app.use("/api/companies", router);
};
