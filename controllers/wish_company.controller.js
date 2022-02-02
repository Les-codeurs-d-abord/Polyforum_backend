const db = require("../models");
const Wish_Company = db.wish_company;
const Wish_CompanyService = require("../services/wish_company.service");
const { Sequelize } = require("../models");

exports.createWishCompany = async (req, res) => {
  const { candidateProfileId, companyProfileId } = req.body;

  if (!(candidateProfileId && companyProfileId)) {
    return res.status(400).send("All input is required");
  }

  const checkExistingWish = await Wish_Company.findOne({
    where: {
      candidateProfileId: candidateProfileId,
      companyProfileId: companyProfileId,
    },
  });

  if (checkExistingWish) {
    return res.status(409).send("Cette entreprise a déja fait ce voeu");
  }

  const companyWishesCount = await Wish_Company.count({
    where: {
      companyProfileId: companyProfileId,
    },
  });

  const wishCompany = {
    candidateProfileId: candidateProfileId,
    companyProfileId: companyProfileId,
    rank: companyWishesCount + 1,
  };

  Wish_Company.create(wishCompany)
    .then((value) => {
      return res.status(201).json({ value });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
};

exports.update = async (req, res) => {
  const wishList = JSON.parse(req.body.data);
  const companyProfileId = req.params.companyProfileId;

  if (!wishList) {
    return res
      .status(400)
      .send("Le nouveau classement est vide, impossible de le traiter");
  }

  try {
    for (let i = 0; i < wishList.length; i++) {
      await Wish_Company.update(
        { rank: i + 1 },
        {
          where: {
            companyProfileId: companyProfileId,
            candidateProfileId: wishList[i],
          },
        }
      );
    }
    return res.send(
      `Classement de voeux de l'entreprise ${companyProfileId} mis à jour`
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.findAllByCompanyId = async (req, res) => {
  const companyProfileId = req.params.companyProfileId;

  if (!companyProfileId) {
    return res.status(400).send("All input is required");
  }

  try {
    const wishesFromCompany = await Wish_CompanyService.findAllByCompanyId(
      companyProfileId
    );
    return res.send(wishesFromCompany);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.checkByCandidateIdAndCompanyId = async (req, res) => {
  const { companyProfileId, candidateProfileId } = req.params;

  if (!(companyProfileId && candidateProfileId)) {
    return res.status(400).send("All input required");
  }

  try {
    const checkWish = await Wish_Company.findOne({
      where: {
        companyProfileId: companyProfileId,
        candidateProfileId: candidateProfileId,
      },
    });
    return res.json({ check: checkWish ? true : false });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.delete = async (req, res) => {
  const { companyProfileId, candidateProfileId } = req.params;

  if (!(companyProfileId && candidateProfileId)) {
    return res.status(400).send("All input required");
  }

  try {
    const wishToDelete = await Wish_Company.findOne({
      where: {
        companyProfileId: companyProfileId,
        candidateProfileId: candidateProfileId,
      },
    });

    const wishDeleted = await Wish_Company.destroy({
      where: {
        companyProfileId: companyProfileId,
        candidateProfileId: candidateProfileId,
      },
    });

    // Wish deleted
    if (wishDeleted) {
      // Decrease rank of following candidate_wishes
      await Wish_Company.decrement(
        { rank: 1 },
        {
          where: {
            rank: { [Sequelize.Op.gt]: wishToDelete.rank },
            companyProfileId: wishToDelete.companyProfileId,
          },
        }
      );
      return res.status(200).send("Voeu supprimé");
    } else {
      // Wish not found
      return res.status(404).send(`Pas de voeux trouvé`);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
