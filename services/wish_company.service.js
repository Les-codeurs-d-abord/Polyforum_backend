const db = require("../models");
const Wish_Company = db.wish_company;
const CandidateProfile = db.candidate_profiles;

exports.update = async (wishId, rank) => {
  try {
    await Wish_Company.update({ rank: rank }, { where: { id: wishId } });
    return rank;
  } catch (err) {
    throw err;
  }
};

exports.findAllByCompanyId = async (companyProfileId) => {
  try {
    const list = await Wish_Company.findAll({
      where: { companyProfileId: companyProfileId },
      include: { model: CandidateProfile },
      order: [[`rank`, `ASC`]],
    });
    return list;
  } catch (err) {
    throw err;
  }
};
