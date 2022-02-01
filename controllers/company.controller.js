const db = require("../models");
const { Sequelize } = require("../models");
const User = db.users;
const CompanyProfile = db.company_profiles;
const CompanyLink = db.company_links;
const Offer = db.offers;
const OfferLink = db.offer_links;
const OfferTag = db.offer_tags;
const WishCandidate = db.wish_candidate;
const WishCompany = db.wish_company;

const UserService = require("../services/user.service");
const CompanyProfileService = require("../services/company_profile.service");
const MailService = require("../services/mail.service");

const fs = require("fs");

// Create a company
exports.createCompany = async (req, res) => {
  const email = req.body.email;
  const companyName = req.body.companyName;

  if (!(email && companyName)) {
    return res
      .status(400)
      .send("Au moins un champ manquant (email / raison sociale)");
  }

  //Check if user already exists
  const checkUser = await User.findOne({ where: { email: email } });
  if (checkUser) {
    return res.status(409).send("Cet email est déjà utilisé");
  }

  //Check if company profile already exists
  const checkCompanyProfile = await CompanyProfile.findOne({
    where: { companyName: companyName },
  });
  if (checkCompanyProfile) {
    return res.status(409).send("Cette entreprise est déjà inscrite");
  }

  try {
    const { user, password } = await UserService.createUser(
      email,
      User.ROLES.COMPANY
    );
    // console.log("Company created : ", user.toJSON())
    const companyProfile = await CompanyProfileService.createCompanyProfile(
      user.id,
      companyName
    );
    // console.log("Company profile created : ", companyProfile.toJSON())
    // TODO Décommenter pour l'envoi des mails
    // await MailService.sendAccountCreated(user.email, password);

    console.log(password);

    return res.status(201).send("Entreprise créée avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find a single company with an id
exports.findById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const company_profile = await CompanyProfile.findOne({
      where: { userId: userId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
        },
        { model: CompanyLink },
      ],
      attributes: { exclude: ["userId"] },
    });
    if (!company_profile) {
      return res.status(404).send("Pas d'entreprise trouvée");
    }
    return res.send(company_profile);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete a single company with an id
exports.deleteById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const checkCompanyProfile = await CompanyProfile.findOne({
      where: { userId: userId },
    });
    if (!checkCompanyProfile) {
      return res.status(409).send("Cette entreprise n'existe pas");
    }

    await WishCompany.destroy({
      where: { companyProfileId: checkCompanyProfile.id },
    });

    await CompanyLink.destroy({
      where: { companyProfileId: checkCompanyProfile.id },
    });

    const offersToDelete = await Offer.findAll({
      where: { companyProfileId: checkCompanyProfile.id },
    });

    const offersToDeleteIds = offersToDelete.map((offerToDelete) => {
      return offerToDelete.id;
    });

    const wishes = await WishCandidate.findAll({
      where: { offerId: { [Sequelize.Op.in]: offersToDeleteIds } },
      order: [["rank", "DESC"]],
    });

    await Promise.all(
      wishes.map(async (wish) => {
        await WishCandidate.decrement(
          { rank: 1 },
          {
            where: {
              rank: { [Sequelize.Op.gt]: wish.rank },
              candidateProfileId: wish.candidateProfileId,
            },
          }
        );
        await WishCandidate.destroy({
          where: { id: wish.id },
        });
      })
    );

    await Offer.destroy({
      where: { id: { [Sequelize.Op.in]: offersToDeleteIds } },
    });

    const profileDeleted = await CompanyProfile.destroy({
      where: { userId: userId },
    });

    await User.destroy({
      where: { id: userId },
    });

    if (profileDeleted) {
      // Profile deleted
      return res.status(200).send("Entreprise supprimée");
    } else {
      // Profile not found
      return res.status(404).send("Pas d'entreprise trouvée");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update a User by the id in the request
exports.updateCompanyProfile = async (req, res) => {
  const userId = req.params.userId;
  const obj = JSON.parse(req.body.data);
  const { companyName, phoneNumber, description, links } = obj;
  const updateContent = {
    companyName: companyName,
    phoneNumber: phoneNumber ? phoneNumber : null,
    description: description ? description : null,
  };

  if (!companyName) {
    return res.status(400).send("Au moins un champ manquant (raison sociale)");
  }

  //Check if this company profile exists
  const checkCompanyProfile = await CompanyProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCompanyProfile) {
    return res.status(409).send("Ce profil d'entreprise n'existe pas");
  }

  try {
    await CompanyProfile.update(updateContent, {
      where: { userid: userId },
    });

    // update status if company has an offer and completed profile
    const checkOffer = await Offer.findOne({
      where: { companyProfileId: checkCompanyProfile.id },
    });
    if (
      checkOffer &&
      phoneNumber &&
      description &&
      checkCompanyProfile.status === "Incomplet"
    ) {
      await CompanyProfile.update(
        { status: "Complet" },
        {
          where: { userId: userId },
        }
      );
    }

    // Delete previous links
    await CompanyLink.destroy({
      where: { companyProfileId: checkCompanyProfile.id },
    });

    // Create new links
    for (let i = 0; i < links.length; i++) {
      await CompanyLink.create({
        companyProfileId: checkCompanyProfile.id,
        label: links[i],
      });
    }

    return res.send(`Profil d'entreprise ${userId} mis à jour`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.companyList = async (req, res) => {
  try {
    const company_profiles = await CompanyProfile.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "email"],
        },
      ],
      attributes: [
        "companyName",
        "logo",
        "status",
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
          FROM wish_companies AS wish_company
          WHERE
          wish_company.companyProfileId = company_profile.id
      )`),
          "wishesCount",
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM offers AS offer
            WHERE
                offer.companyProfileId = company_profile.id
        )`),
          "offersCount",
        ],
      ],
    });
    return res.send(company_profiles);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.uploadLogo = async (req, res) => {
  const userId = req.params.userId;
  try {
    const filePath = req.files["logo"].path
      .replace("data\\", "")
      .replace("\\", "/");

    const checkCompanyProfile = await CompanyProfile.findOne({
      where: { userId: userId },
    });

    CompanyProfile.update(
      { logo: filePath },
      {
        where: { userId: userId },
      }
    );
    if (checkCompanyProfile.logo !== null) {
      fs.unlink("data/" + checkCompanyProfile.logo, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    // SUCCESS, Image successfully uploaded
    return res.send(filePath);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.findOffersById = async (req, res) => {
  const userId = req.params.userId;

  const checkCompanyProfile = await CompanyProfile.findOne({
    where: { userId: userId },
  });

  if (!checkCompanyProfile) {
    return res.status(404).send("Cette entreprise n'existe pas");
  }

  try {
    const offers = await Offer.findAll({
      where: { companyProfileId: checkCompanyProfile.id },
      include: [
        { model: OfferLink },
        { model: OfferTag },
        { model: CompanyProfile },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
            SELECT COUNT(*)
            FROM wish_candidates AS wish_candidate
            WHERE
            wish_candidate.offerId = offer.id
        )`),
            "candidatesWishesCount",
          ],
        ],
      },
    });

    return res.send(offers);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
