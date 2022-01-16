module.exports = (app) => {
  const companyController = require("../controllers/company.controller.js");

  const router = require("express").Router();
  const cors = require("../middleware/cors");

  // Create a new company User
  router.post("/", cors, companyController.createCompany);

  // Retrieve all companies
  router.get("/", cors, companyController.companyList);

  // Retrieve a single company with id
  router.get("/:userId", cors, companyController.findById);

  // Delete a single company with id
  router.delete("/:userId", cors, companyController.deleteById);

  // Update a company profile with id
  router.put("/:userId", cors, companyController.updateCompanyProfile)

  app.use("/api/companies", router);
};
