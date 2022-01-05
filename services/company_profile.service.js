const db = require("../models");
const CompanyProfile = db.company_profiles;

exports.createCompanyProfile = async (userId, companyName) => {
    const companyProfile = {
        userId: userId,
        companyName: companyName
    };

    try {
        const savedCompanyProfile = await CompanyProfile.create(companyProfile);
        return savedCompanyProfile;
    } catch (err) {
        throw new Error(err.message);
    }
}