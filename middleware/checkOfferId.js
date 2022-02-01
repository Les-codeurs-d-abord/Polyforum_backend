const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models");
const Offers = db.offers;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token." });
      } else {
        if (decoded.role && decoded.role == "ENTREPRISE") {
          const checkOffer = await Offers.findOne({
            where: { id: req.params.offerId },
          });
          if (checkOffer.companyProfileId == decoded.companyProfileId) {
            next();
          } else {
            return res.status(401).json({ error: "Unauthorized" });
          }
        } else if (decoded.role && decoded.role == "ADMIN") {
          next();
        } else {
          return res.status(401).json({ error: "Unauthorized" });
        }
      }
    });
  } catch {
    return res.status(401).json({
      error: "Invalid request.",
    });
  }
};
