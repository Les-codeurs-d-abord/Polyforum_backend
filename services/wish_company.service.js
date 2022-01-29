const db = require("../models");
const Wish_Company = db.wish_company;
const CandidateProfile = db.candidate_profiles;
const User = db.users;
const CandidateLink = db.candidate_links;
const CandidateTag = db.candidate_tags;

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
      include: {
        model: CandidateProfile,
        include: [
          {model: User,
          attributes: { exclude: ["password"] }},
          { model: CandidateLink },
          { model: CandidateTag },
        ],
      },
      order: [[`rank`, `ASC`]],
    });
    return list;
  } catch (err) {
    throw err;
  }
};
