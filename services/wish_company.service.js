const db = require("../models");
const Wish_Company = db.wish_company;

exports.createWishCompany = async (candidateId, companyId) => {
    const wishData = {
        candidateId: candidateId,
        companyId: companyId
    };
    const wish = await Wish_Company.create(wishData);
    return wish; 
}