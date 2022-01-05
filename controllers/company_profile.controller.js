const db = require("../models");
const CompanyProfile = db.company_profiles;

// Create a company profile
exports.create = async (req, res) => {
    const companyProfile = {
        companyName: req.body.companyName
    };

    try {
        const savedCompanyProfile = await CompanyProfile.create(user);
        return res.send(savedCompanyProfile);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};
