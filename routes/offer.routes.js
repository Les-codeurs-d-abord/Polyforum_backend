module.exports = (app) => {
  var multiparty = require("connect-multiparty");
  const offer = require("../controllers/offer.controller.js");
  const router = require("express").Router();
  var multiparty = require("connect-multiparty");
  const auth = require("../middleware/auth");
  const checkOfferId = require("../middleware/checkOfferId.js");
  const checkCompanyId = require("../middleware/checkCompanyId.js");

  // Upload offer file
  multipartyOfferMiddleware = multiparty({
    uploadDir: "./data/offerFiles",
    maxFilesSize: "4000000",
  });
  router.post("/:offerId/upload", checkOfferId, multipartyOfferMiddleware, offer.upload);

  // Create offer
  router.post("/:companyProfileId", checkCompanyId, offer.createOffer);

  // Get all offers
  router.get("", auth(["ADMIN", "CANDIDAT"]), offer.getAllOffer);

  // Update offer
  router.put("/:offerId", checkOfferId, offer.updateOffer);

  // Delete offer
  router.delete("/:offerId", checkOfferId, offer.deleteOffer);

  app.use("/api/offer", router);
};
