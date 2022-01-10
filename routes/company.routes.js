module.exports = (app) => {
  const companyController = require("../controllers/company.controller.js");

  const router = require("express").Router();
  const cors = require("../middleware/cors");

  // Create a new company User
  router.post("/", cors, companyController.createCompany);

  // Retrieve all companies
  router.get("/", companyController.companyList);

  // Retrieve a single company with id
  router.get("/:userId", companyController.findById);

  // Delete a single company with id
  router.delete("/:userId", companyController.deleteById);

  app.use("/api/companies", router);
};
