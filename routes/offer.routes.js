module.exports = app => {
  const offer = require("../controllers/offer.controller.js");
  const router = require("express").Router();
  const cors = require("../middleware/cors");

  //offer
  router.post("", offer.createOffer);
  router.post("/:offerId/upload", offer.upload);
  router.get("", cors, offer.getAllOffer);
  router.put("/:offerId", offer.updateOffer)

  //offer_tags
  router.post("/tag", cors, offer.createOfferTag);
  router.get("/tag/:offerId", cors, offer.findOfferTagByOfferId);
  router.post("/link", cors, offer.createOfferLink);

  app.use('/api/offer', router);
};
