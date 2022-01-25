const db = require("../models");
const Wish_Company = db.wish_company;
const Wish_CompanyService = require("../services/wish_company.service");
const { Sequelize } = require("../models");

exports.createWishCompany = async (req, res) => {
  const { candidateId, companyId } = req.body;

  if (!(candidateId && companyId)) {
    return res.status(400).send("All input is required");
  }

  const checkExistingWish = await Wish_Company.findOne({where: {
    candidateId: candidateId,
    companyId: companyId
  }})

  if (checkExistingWish) {
    return res.status(409).send("Cette entreprise a déja fait ce voeu")
  }

  const companyWishesCount = await Wish_Company.count({
    where: {
      companyId: companyId,
    },
  });

  if (companyWishesCount >= 8) {
    return res.status(409).send("Cette entreprise a déjà 8 voeux");
  }

  const wishCompany = {
    candidateId: candidateId,
    companyId: companyId,
    rank: companyWishesCount + 1,
  };

  Wish_Company.create(wishCompany)
    .then((value) => res.status(201).json({ value }))
    .catch((error) => res.status(400).json({ error }));
};

exports.update = async (req, res) => {
  const wishList = req.body.wishList;
  const companyId = req.params.companyId;

  if (!wishList) {
    return res
      .status(400)
      .send("Le nouveau classement est vide, impossible de le traiter");
  }

  try {
    for (let i = 0; i < wishList.length; i++) {
      await Wish_Company.update(
        { rank: i + 1 },
        { where: { companyId: companyId, candidateId: wishList[i] } }
      );
    }
    return res.send(
      `Classement de voeux de l'entreprise ${companyId} mis à jour`
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.findAllByCompanyId = async (req, res) => {
  const companyId = req.params.companyId;

  if (!companyId) {
    return res.status(400).send("All input is required");
  }

  try {
    const wishesFromCompany = await Wish_CompanyService.findAllByCompanyId(
      companyId
    );
    return res.send(wishesFromCompany);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.deleteById = async (req, res) => {
  const wishId = req.params.wishId;

  try {
    const wishToDelete = await Wish_Company.findByPk(wishId);

    const wishDeleted = await Wish_Company.destroy({
      where: { id: wishId },
    });

    // Wish deleted
    if (wishDeleted) {
      // Decrease rank of following candidate_wishes
      await Wish_Company.decrement(
        { rank: 1 },
        {
          where: {
            rank: { [Sequelize.Op.gt]: wishToDelete.rank },
            companyId: wishToDelete.companyId,
          },
        }
      );
      return res.status(200).send("Voeu supprimé");
    } else {
      // Wish not found
      return res.status(404).send(`Pas de voeux trouvé avec l'id ${wishId}`);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
