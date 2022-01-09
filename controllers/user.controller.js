const db = require("../models");
const User = db.users;
const CompanyProfile = db.company_profiles;
const CandidateProfile = db.candidate_profiles;
const Op = db.Sequelize.Op;

const UserService = require("../services/user.service");
const CompanyProfileService = require("../services/company_profile.service");
const CandidateProfileService = require("../services/candidate_profile.service");
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

// Create a candidate
exports.createCandidate = async (req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!(email && firstName && lastName)) {
    return res
      .status(400)
      .send("Au moins un champ manquant (email / nom / prénom)");
  }

  //Check if user already exists
  const checkUser = await User.findOne({ where: { email: email } });
  if (checkUser) {
    return res.status(409).send("Cet email est déjà utilisé");
  }

  //Check if candidate profile already exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { firstName: firstName, lastName: lastName },
  });
  if (checkCandidateProfile) {
    return res.status(409).send("Ce candidat est déjà inscrit");
  }

  try {
    const { user, password } = await UserService.createUser(
      email,
      User.ROLES.CANDIDATE
    );
    console.log("Candidate created : ", user.toJSON());
    const candidateProfile =
      await CandidateProfileService.createCandidateProfile(
        user.id,
        firstName,
        lastName
      );
    console.log("Candidate profile created : ", candidateProfile.toJSON());
    // await MailServiSce.sendAccountCreated(user.email, password);

    return res.status(201).send("Candidat créé avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find a single User with an id
exports.findById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(id);

    if (user) {
      return res.send(user);
    } else {
      return res.status(404).send(`Aucun utilisateur trouvé pour l'id ${id}`);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  const updateContent = {
    email: req.body.email,
    lastName: req.body.lastName,
    age: req.body.age,
  };

  try {
    const test = await User.update(updateContent, {
      where: { id: id },
    });
    console.log(test);
    if (test > 0) {
      return res.send({ message: `Utilisateur ${id} mis à jour` });
    } else {
      return res.send({
        message: `Aucune mise à jour pour l'utilisateur ${id}`,
      });
    }
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

// Find all admins
exports.findAllAdmins = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: {
          [Op.eq]: User.ROLES.ADMIN,
        },
      },
    });
    return res.send(users);
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

exports.candidateList = async (req, res) => {
  try {
    const candidate_profiles = await CandidateProfile.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "email"],
        },
      ],
      attributes: ["firstName", "lastName"],
    });
    return res.send(candidate_profiles);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
