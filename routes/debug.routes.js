module.exports = app => {
  const debug = require("../controllers/debug.controller.js");

  const router = require("express").Router();

  const cors = require("../middleware/cors");

  //offer
  router.post("/post/offer", debug.create);
  router.get("/offers", cors, debug.getAll);


  //tag
  router.post("/post/tag", debug.createTag);
  router.get("/tag/:id", cors, debug.findTagById);
  router.get("/tag", cors, debug.findAllTags);

  //offer_tags
  router.post("/post/offer_tag", debug.createOfferTag);
  router.get("/offer_tag/:offerId", cors, debug.findOfferTagByOfferId);
  router.get("/offer_tag", cors, debug.findAllOfferTags);

  app.use('/api/debug', router);
};
