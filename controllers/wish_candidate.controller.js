const db = require("../models");
const Wish_Candidate = db.wish_candidate;
const Wish_CandidateService = require("../services/wish_candidate.service");
const { Sequelize } = require("../models");

exports.createWishCandidate = async (req, res) => {
  const { candidateProfileId, offerId } = req.params;

  if (!(candidateProfileId && offerId)) {
    return res.status(400).send("All input is required");
  }

  const checkExistingWish = await Wish_Candidate.findOne({
    where: {
      candidateProfileId: candidateProfileId,
      offerId: offerId,
    },
  });

  if (checkExistingWish) {
    return res.status(409).send("Ce candidat a déja fait ce voeu");
  }

  const candidateWishesCount = await Wish_Candidate.count({
    where: {
      candidateProfileId: candidateProfileId,
    },
  });

  const wishCandidate = {
    candidateProfileId: candidateProfileId,
    offerId: offerId,
    rank: candidateWishesCount + 1,
  };

  Wish_Candidate.create(wishCandidate)
    .then((value) => res.status(201).json({ value }))
    .catch((error) => res.status(400).json({ error }));
};

exports.update = async (req, res) => {
  const wishList = JSON.parse(req.body.data);
  const candidateProfileId = req.params.candidateProfileId;

  if (!wishList) {
    return res
      .status(400)
      .send("Le nouveau classement est vide, impossible de le traiter");
  }

  try {
    for (let i = 0; i < wishList.length; i++) {
      await Wish_Candidate.update(
        { rank: i + 1 },
        {
          where: {
            candidateProfileId: candidateProfileId,
            offerId: wishList[i],
          },
        }
      );
    }
    return res.send(
      `Classement de voeux du candidat ${candidateProfileId} mis à jour`
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.findAllByCandidateId = async (req, res) => {
  const candidateProfileId = req.params.candidateProfileId;

  if (!candidateProfileId) {
    return res.status(400).send("All input is required");
  }

  try {
    const wishesFromCandidate =
      await Wish_CandidateService.findAllByCandidateId(candidateProfileId);
    return res.send(wishesFromCandidate);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.checkByCandidateIdAndOfferId = async (req, res) => {
  const { candidateProfileId, offerId } = req.params;

  if (!(offerId && candidateProfileId)) {
    return res.status(400).send("All input required");
  }

  try {
    const checkWish = await Wish_Candidate.findOne({
      where: {
        offerId: offerId,
        candidateProfileId: candidateProfileId,
      },
    });
    if (checkWish) {
      return res.send();
    }
    res.status(404).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.delete = async (req, res) => {
  const { candidateProfileId, offerId } = req.params;

  if (!(offerId && candidateProfileId)) {
    res.status(400).send("All input required");
  }

  try {
    const wishToDelete = await Wish_Candidate.findOne({
      where: { offerId: offerId, candidateProfileId: candidateProfileId },
    });
    const wishDeleted = await Wish_Candidate.destroy({
      where: { offerId: offerId, candidateProfileId: candidateProfileId },
    });

    // Wish deleted
    if (wishDeleted) {
      // Decrease rank of following candidate_wishes
      await Wish_Candidate.decrement(
        { rank: 1 },
        {
          where: {
            rank: { [Sequelize.Op.gt]: wishToDelete.rank },
            candidateProfileId: wishToDelete.candidateProfileId,
          },
        }
      );
      return res.status(200).send("Voeux supprimé");
    } else {
      // Wish not found
      return res.status(404).send(`Pas de voeux trouvé`);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
