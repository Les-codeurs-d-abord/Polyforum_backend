const db = require("../models");
const CandidateProfile = db.candidate_profiles;
const User = db.users;
const CandidateLink = db.candidate_links;
const CandidateTag = db.candidate_tags;

exports.createCandidateProfile = async (userId, firstName, lastName) => {
  const candidateProfile = {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    status: "Jamais connecté",
  };

  try {
    const savedCandidateProfile = await CandidateProfile.create(
      candidateProfile
    );
    return savedCandidateProfile;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.findById = async (userId) => {
  return await CandidateProfile.findOne({
    where: { userId: userId },
    include: [
      {
        model: User,
        attributes: ["id", "email", "role"],
      },
      { model: CandidateLink },
      { model: CandidateTag },
    ],
  });
};
