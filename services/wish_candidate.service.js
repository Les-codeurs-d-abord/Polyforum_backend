const db = require("../models");
const Wish_Candidate = db.wish_candidate;
const Offer = db.offers;
const OfferLink = db.offer_links;
const OfferTag = db.offer_tags;

exports.update = async (wishId, rank) => {
  try {
    await Wish_Candidate.update({ rank: rank }, { where: { id: wishId } });
    return rank;
  } catch (err) {
    throw err;
  }
};

exports.findAllByCandidateId = async (candidateProfileId) => {
  try {
    const list = await Wish_Candidate.findAll({
      where: { candidateProfileId: candidateProfileId },
      order: [[`rank`, `ASC`]],
      include: [
        { model: Offer, include: [{ model: OfferLink }, { model: OfferTag }] },
      ],
    });
    return list;
  } catch (err) {
    throw err;
  }
};
