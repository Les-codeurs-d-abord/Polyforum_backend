module.exports = app => {
    const planning = require("../controllers/planning.controller.js");
    const router = require("express").Router();
    const cors = require("../middleware/cors");

    router.get("", planning.generationPlanning);
  
    // //offer
    // router.post("", offer.createOffer);
    // router.get("", cors, offer.getAllOffer);
  
    // //offer_tags
    // router.post("/tag", cors, offer.createOfferTag);
    // router.get("/tag/:offerId", cors, offer.findOfferTagByOfferId);
    // router.get("/tag", cors, offer.findAllOfferTags);
    // router.post("/link", cors, offer.createOfferLink);
  
    app.use('/api/planning', router);
  };
  