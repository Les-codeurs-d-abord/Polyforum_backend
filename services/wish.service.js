const { wish_company } = require("../models");
const db = require("../models");
const Wish_Candidate = db.wish_candidate;
const Wish_Company = db.wish_company;

exports.createWishCandidate = async (candidateId, offerId) => {
    const wishData = {
        candidateId: candidateId,
        offerId: offerId
    };
    const wish = await Wish_Candidate.create(wishData);
    return wish;
}

exports.createWishCompany = async (candidateId, offerId) => {

}