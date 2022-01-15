const db = require("../models");
const Wish_Candidate = db.wish_candidate;
const Wish_CandidateService = require("../services/wish_candidate.service");


exports.createWishCandidate = async (req, res) => {
    const { rank, candidateId, offerId } = req.body;

    if (!(candidateId && offerId && rank)) {
        return res.status(400).send("All input is required");
    }

    const wishCandidate = {
        candidateId: candidateId,
        offerId: offerId,
        rank: rank
    };

    Wish_Candidate.create(wishCandidate)
    .then((value) => res.status(201).json({ value }))
    .catch(error => res.status(400).json({ error })
    );
};


exports.update = async (req, res) => {
    const wishId = req.params.wishId;
    const rank = req.body.rank;
  
    if (!rank) {
      return res.status(400).send("Le nouveau classement est vide, impossible de le traiter");
    }

    try {
      newRank = await Wish_CandidateService.update(wishId, rank);
      return res.send(`Voeux ${wishId} mis à jour avec le nouveau rang ${newRank}`);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  exports.findAllByCandidateId = async (req, res) => {
    const candidateId = req.params.candidateId;
    
    if (!(candidateId)) {
      return res.status(400).send("All input is required");
    }

    try {
      const wishesFromCandidate = await Wish_CandidateService.findAllByCandidateId(candidateId);
      return res.send(wishesFromCandidate);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };


  exports.deleteById = async (req, res) => {
    const wishId = req.params.wishId;

    try {
        const wishDeleted = await Wish_Candidate.destroy({
          where: { id: wishId },
        });
    
        if (wishDeleted) {
          // Wish deleted
          return res.status(200).send("Voeux supprimé");
        } else {
          // Wish not found
          return res.status(404).send(`Pas de voeux trouvé avec l'id ${wishId}`);
        }
      } catch (err) {
        return res.status(500).send(err.message);
      }

  };
