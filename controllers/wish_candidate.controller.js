const db = require("../models");
const Wish_Candidate = db.wish_candidate;
const Wish_CandidateService = require("../services/wish_candidate.service");
const { Sequelize } = require("../models");

exports.createWishCandidate = async (req, res) => {
  const { candidateId, offerId } = req.body;

  if (!(candidateId && offerId)) {
    return res.status(400).send("All input is required");
  }

  const candidateWishesCount = await Wish_Candidate.count({
    where: {
      candidateId: candidateId,
    },
  });

  if (candidateWishesCount >= 8) {
    return res.status(409).send("Ce candidat a déjà 8 voeux");
  }

  const wishCandidate = {
    candidateId: candidateId,
    offerId: offerId,
    rank: candidateWishesCount + 1,
  };

  Wish_Candidate.create(wishCandidate)
    .then((value) => res.status(201).json({ value }))
    .catch((error) => res.status(400).json({ error }));
};

exports.update = async (req, res) => {
  const wishList = req.body.wishList;
  const candidateId = req.params.candidateId;

  if (!wishList) {
    return res
      .status(400)
      .send("Le nouveau classement est vide, impossible de le traiter");
  }

  try {
    for (let i = 0; i < wishList.length; i++) {
      await Wish_Candidate.update(
        { rank: i + 1 },
        { where: { candidateId: candidateId, offerId: wishList[i] } }
      );
    }
    return res.send(
      `Classement de voeux du candidat ${candidateId} mis à jour`
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.findAllByCandidateId = async (req, res) => {
  const candidateId = req.params.candidateId;

  if (!candidateId) {
    return res.status(400).send("All input is required");
  }

  try {
    const wishesFromCandidate =
      await Wish_CandidateService.findAllByCandidateId(candidateId);
    return res.send(wishesFromCandidate);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.deleteById = async (req, res) => {
  const wishId = req.params.wishId;

  try {
    const wishToDelete = await Wish_Candidate.findByPk(wishId);

    const wishDeleted = await Wish_Candidate.destroy({
      where: { id: wishId },
    });

    // Wish deleted
    if (wishDeleted) {
      // Decrease rank of following candidate_wishes
      await Wish_Candidate.decrement(
        { rank: 1 },
        {
          where: {
            rank: { [Sequelize.Op.gt]: wishToDelete.rank },
            candidateId: wishToDelete.candidateId,
          },
        }
      );
      return res.status(200).send("Voeux supprimé");
    } else {
      // Wish not found
      return res.status(404).send(`Pas de voeux trouvé avec l'id ${wishId}`);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
