const db = require("../models");
const Offers = db.offers;

// Create an offer
exports.create = async (req, res) => {
  console.log("test");
  const { name, description, companyId } = req.body;

  // Validate input
  if (!(name && description && companyId)) {
    return res.status(400).send("All input is required");
  }

  const offer = {
    name: name,
    description: description,
    companyId: companyId
  };

  Offers.create(offer)
    .then((value) => res.status(201).json({ value }))
    .catch(error => res.status(400).json({ error })
    );
};