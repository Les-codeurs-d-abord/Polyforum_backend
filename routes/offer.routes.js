module.exports = (app) => {
  var multiparty = require("connect-multiparty");
  const offer = require("../controllers/offer.controller.js");
  const router = require("express").Router();
  var multiparty = require('connect-multiparty');

  //offer
  router.post("", offer.createOffer);
  // Upload offer file
  multipartyOfferMiddleware = multiparty({
    uploadDir: "./data/offerFiles",
    maxFilesSize: "4000000",
  });
  router.post("/:offerId/upload", multipartyOfferMiddleware, offer.upload);

  router.get("", offer.getAllOffer);
  router.put("/:offerId", offer.updateOffer);
  router.delete("/:offerId", offer.deleteOffer);

  //offer_tags
  router.post("/tag", offer.createOfferTag);
  router.get("/tag/:offerId", offer.findOfferTagByOfferId);
  router.post("/link", offer.createOfferLink);

  app.use("/api/offer", router);
};
