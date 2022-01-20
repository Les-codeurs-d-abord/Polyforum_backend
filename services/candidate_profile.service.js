const db = require("../models");
const CandidateProfile = db.candidate_profiles;

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
