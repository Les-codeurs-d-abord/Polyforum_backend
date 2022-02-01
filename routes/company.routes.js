module.exports = (app) => {
  var multiparty = require("connect-multiparty");
  const companyController = require("../controllers/company.controller.js");
  const auth = require("../middleware/auth");
  const checkRoleAndUserId = require("../middleware/checkRoleAndUserId");

  const router = require("express").Router();

  // Retrieve all companies
  router.get("/", auth(["ADMIN"]), companyController.companyList);

  // Retrieve all company's offers with id
  router.get(
    "/:userId/offer",
    auth(["ADMIN", "CANDIDAT"]),
    companyController.findOffersById
  );

  // Retrieve a single company with id
  router.get("/:userId", auth(["*"]), companyController.findById);

  // Create a new company User
  router.post("/", auth(["ADMIN"]), companyController.createCompany);

  // Upload a profile picture
  multipartyLogoMiddleware = multiparty({
    uploadDir: "./data/companyLogos",
    maxFilesSize: "4000000",
  });
  router.post(
    "/:userId/uploadLogo",
    checkRoleAndUserId(["ENTREPRISE"]),
    multipartyLogoMiddleware,
    companyController.uploadLogo
  );

  // Delete a single company with id
  router.delete("/:userId", auth(["ADMIN"]), companyController.deleteById);

  // Update a company profile with id
  router.put(
    "/:userId",
    checkRoleAndUserId(["ENTREPRISE"]),
    companyController.updateCompanyProfile
  );

  app.use("/api/companies", router);
};
