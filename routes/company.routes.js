module.exports = (app) => {
  const companyController = require("../controllers/company.controller.js");

  const router = require("express").Router();

  // Retrieve all companies
  router.get("/", companyController.companyList);

  // Retrieve a single company with id
  router.get("/:userId", companyController.findById);

  // Create a new company User
  router.post("/", companyController.createCompany);

  // Upload a profile picture
  router.post("/:userId/uploadLogo", companyController.uploadLogo);

  // Delete a single company with id
  router.delete("/:userId", companyController.deleteById);

  // Update a company profile with id
  router.put("/:userId", companyController.updateCompanyProfile);

  app.use("/api/companies", router);
};
