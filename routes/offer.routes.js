module.exports = app => {
  const offer = require("../controllers/offer.controller.js");
  const router = require("express").Router();

  //offer
  router.post("", offer.createOffer);
  router.post("/:offerId/upload", offer.upload);
  router.get("", offer.getAllOffer);
  router.put("/:offerId", offer.updateOffer)
  router.delete("/:offerId", offer.deleteOffer)

  //offer_tags
  router.post("/tag", offer.createOfferTag);
  router.get("/tag/:offerId", offer.findOfferTagByOfferId);
  router.post("/link", offer.createOfferLink);

  app.use('/api/offer', router);
};
