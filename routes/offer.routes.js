module.exports = app => {
  const offer = require("../controllers/offer.controller.js");
  const router = require("express").Router();
  const cors = require("../middleware/cors");

  //offer
  router.post("", offer.createOffer);
  router.get("", cors, offer.getAllOffer);

  //offer_tags
  router.post("/tag", cors, offer.createOfferTag);
  router.get("/tag/:offerId", cors, offer.findOfferTagByOfferId);
  router.get("/tag", cors, offer.findAllOfferTags);
  router.post("/link", cors, offer.createOfferLink);

  app.use('/api/offer', router);
};
