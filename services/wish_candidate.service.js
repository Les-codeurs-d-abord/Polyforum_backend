const db = require("../models");
const Wish_Candidate = db.wish_candidate;

exports.update = async (wishId, rank) => {
  try {
    await Wish_Candidate.update({ rank: rank }, { where: { id: wishId } });
    return rank;
  } catch (err) {
    throw err;
  }
};

exports.findAllByCandidateId = async (candidateId) => {
  try {
    const list = await Wish_Candidate.findAll({
      where: { candidateId: candidateId },
      order: [[`rank`, `ASC`]],
    });
    return list;
  } catch (err) {
    throw err;
  }
};
