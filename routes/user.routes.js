module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  const router = require("express").Router();
  const cors = require("../middleware/cors");

  // Create a new company User
  router.post("/companies", cors, users.createCompany);

  // Create a new candidate User
  router.post("/candidates", cors, users.createCandidate);

  // Retrieve all admins
  router.get("/admins", users.findAllAdmins);

  // Retrieve all companies
  router.get("/companyList", users.companyList);

  // Retrieve all candidates
  router.get("/candidateList", users.candidateList);

  // Retrieve a single User with id
  router.get("/:id", users.findById);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  app.use("/api/users", router);
};
