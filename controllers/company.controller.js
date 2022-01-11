const db = require("../models");
const User = db.users;
const CompanyProfile = db.company_profiles;
const Op = db.Sequelize.Op;

const UserService = require("../services/user.service");
const CompanyProfileService = require("../services/company_profile.service");
const MailService = require("../services/mail.service");

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

    return res.status(201).send("Entreprise créée avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find a single company with an id
exports.findById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const company_profile = await CompanyProfile.findAll({
      where: { userId: userId },
      include: [
        {
          model: User,
          attributes: ["id", "email"],
        },
      ],
    });
    if (!company_profile.length) {
      return res.status(404).send("Pas d'entreprise trouvée");
    }
    return res.send(company_profile[0]);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete a single company with an id
exports.deleteById = async (req, res) => {
  const userId = req.params.userId;
  try {
    // const company_profile = await CompanyProfile.findByPk(id)
    const profileDeleted = await CompanyProfile.destroy({
      where: { userId: userId },
    });

    await User.destroy({
      where: { id: userId },
    });

    if (profileDeleted) {
      // Profile deleted
      return res.status(200).send();
    } else {
      // Profile not found
      return res.status(204).send();
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update a User by the id in the request
exports.updateCompanyProfile = async (req, res) => {
  const companyProfileId = req.params.companyProfileId;
  const updateContent = {
    companyName: req.body.companyName,
    phoneNumber: req.body.phoneNumber,
    description: req.body.description,
  };

  if (!updateContent.companyName) {
    return res
      .status(400)
      .send(
        "Au moins un champ manquant (raison sociale / téléphone / description)"
      );
  }

  //Check if this company profile exists
  const checkCompanyProfile = await CompanyProfile.findOne({
    where: { id: companyProfileId },
  });
  if (!checkCompanyProfile) {
    return res.status(409).send("Ce profil d'entreprise n'existe pas");
  }

  try {
    await CompanyProfile.update(updateContent, {
      where: { id: companyProfileId },
    });
    return res.send({ message: `Profil d'entreprise ${companyProfileId} mis à jour` });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete a User by the id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteCount = await User.destroy({
      where: { id: id },
    });
    if (deleteCount === 1) {
      return res.send({ message: `Utilisateur ${id} supprimé` });
    } else {
      return res.send({
        message: `Suppression impossible pour l'utilisateur ${id}`,
      });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find all companies
exports.findAllCompanies = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: {
          [Op.eq]: User.ROLES.COMPANY,
        },
      },
    });
    return res.send(users);
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
      attributes: ["companyName", "logo"],
    });
    return res.send(company_profiles);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
