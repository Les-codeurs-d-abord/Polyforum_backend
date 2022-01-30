module.exports = (app) => {
  var multiparty = require("connect-multiparty");
  const offer = require("../controllers/offer.controller.js");
  const router = require("express").Router();

  // Create offer
  router.post("/:companyProfileId", offer.createOffer);

  // Upload offer file
  multipartyOfferMiddleware = multiparty({
    uploadDir: "./data/offerFiles",
    maxFilesSize: "4000000",
  });
  router.post("/:offerId/upload", multipartyLogoMiddleware, offer.upload);

  // Get all offers
  router.get("", offer.getAllOffer);

  // Update offer
  router.put("/:offerId", offer.updateOffer);

  // Delete offer
  router.delete("/:offerId", offer.deleteOffer);

  app.use("/api/offer", router);
};
