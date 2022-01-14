const { wish_candidate } = require("../models");
const db = require("../models");
const Wish_Candidate = db.wish_candidate;


exports.createWishCandidate = asyn (req, rest) => {
    const { candidateId, offerId } = req.body;

    if (!(candidateId && offerId)) {
        return res.status(400).send("All input is required");
    }

    const wishCandidate = {
        candidateId: candidateId,
        offerId: offerId
    }

    Wish_Candidate.create(wish_candidate)
    .then((value) => res.status(201).json({ value }))
    .catch(error => res.status(400).json({ error })
    );
};
