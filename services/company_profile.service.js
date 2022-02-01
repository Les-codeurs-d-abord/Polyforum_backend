const db = require("../models");
const User = db.users;
const CompanyProfile = db.company_profiles;

exports.createCompanyProfile = async (userId, companyName) => {
  const companyProfile = {
    userId: userId,
    companyName: companyName,
    status: "Jamais connecté",
  };

  try {
    const savedCompanyProfile = await CompanyProfile.create(companyProfile);
    return savedCompanyProfile;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.findById = async (userId) => {
  return await CompanyProfile.findOne({
    where: { userId: userId },
    include: [
      {
        model: User,
        attributes: ["id", "email", "role"],
      },
    ],
  });
};
