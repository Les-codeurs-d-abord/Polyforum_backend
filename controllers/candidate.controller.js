const db = require("../models");
const { Sequelize } = require("../models");
const User = db.users;
const CandidateProfile = db.candidate_profiles;
const CandidateLink = db.candidate_links;
const CandidateTag = db.candidate_tags;
const WishCandidate = db.wish_candidate;
const WishCompany = db.wish_company;

const UserService = require("../services/user.service");
const CandidateProfileService = require("../services/candidate_profile.service");
const MailService = require("../services/mail.service");

const fs = require("fs");

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
    console.log("Password ", password);
    // TODO Décommenter pour l'envoi des mails
    await MailService.sendAccountCreated(user.email, password);

    return res.status(201).send("Candidat créé avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// List all candidates
exports.candidateList = async (req, res) => {
  try {
    const candidate_profiles = await CandidateProfile.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
        { model: CandidateLink },
        { model: CandidateTag },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
            SELECT COUNT(*)
            FROM wish_candidates AS wish_candidate
            WHERE
            wish_candidate.candidateProfileId = candidate_profile.id
        )`),
            "wishesCount",
          ],
        ],
      },
    });
    return res.send(candidate_profiles);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find a single candidate with an id
exports.findById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const candidate_profile = await CandidateProfileService.findById(userId);
    if (!candidate_profile) {
      return res.status(404).send("Pas de candidat trouvée");
    }
    return res.send(candidate_profile);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete a single candidate with an id
exports.deleteById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const checkCandidateProfile = await CandidateProfile.findOne({
      where: { userId: userId },
    });
    if (!checkCandidateProfile) {
      return res.status(409).send("Ce candidat n'existe pas");
    }

    await WishCandidate.destroy({
      where: { candidateProfileId: checkCandidateProfile.id },
    });

    const wishesCompanies = await WishCompany.findAll({
      where: { candidateProfileId: checkCandidateProfile.id },
    });

    await Promise.all(
      wishesCompanies.map(async (wishCompany) => {
        await WishCompany.decrement(
          { rank: 1 },
          {
            where: {
              rank: { [Sequelize.Op.gt]: wishCompany.rank },
              companyProfileId: wishCompany.companyProfileId,
            },
          }
        );
        await WishCompany.destroy({ where: { id: wishCompany.id } });
      })
    );

    await CandidateLink.destroy({
      where: { candidateProfileId: checkCandidateProfile.id },
    });

    await CandidateTag.destroy({
      where: { candidateProfileId: checkCandidateProfile.id },
    });

    await CandidateProfile.destroy({
      where: { userId: userId },
    });

    await User.destroy({
      where: { id: userId },
    });

    return res.status(200).send("Candidat supprimé");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update a User by the id in the request
exports.updateCandidateProfile = async (req, res) => {
  const obj = JSON.parse(req.body.data);
  const userId = req.params.userId;
  const {
    firstName,
    lastName,
    phoneNumber,
    description,
    address,
    tags,
    links,
  } = obj;

  const updateContent = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber ? phoneNumber : null,
    description: description ? description : null,
    address: address ? address : null,
  };

  if (!(firstName && lastName)) {
    return res.status(400).send("Au moins un champ manquant (nom, prénom)");
  }

  //Check if this candidate profile exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCandidateProfile) {
    return res.status(409).send("Ce profil de candidat n'existe pas");
  }

  try {
    await CandidateProfile.update(updateContent, {
      where: { userId: userId },
    });

    if (checkCandidateProfile.cv && phoneNumber && description) {
      await CandidateProfile.update(
        { status: "Complet" },
        {
          where: { userId: userId },
        }
      );
    }

    // Delete previous tags
    await CandidateTag.destroy({
      where: { candidateProfileId: checkCandidateProfile.id },
    });

    // Create new tags
    for (let i = 0; i < tags.length; i++) {
      await CandidateTag.create({
        candidateProfileId: checkCandidateProfile.id,
        label: tags[i],
      });
    }

    // Delete previous links
    await CandidateLink.destroy({
      where: { candidateProfileId: checkCandidateProfile.id },
    });

    // Create new links
    for (let i = 0; i < links.length; i++) {
      await CandidateLink.create({
        candidateProfileId: checkCandidateProfile.id,
        label: links[i],
      });
    }

    const updatedProfile = await CandidateProfileService.findById(userId);

    return res.send(updatedProfile);
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

    const checkCandidateProfile = await CandidateProfile.findOne({
      where: { userId: userId },
    });

    CandidateProfile.update(
      { logo: filePath },
      {
        where: { userId: userId },
      }
    );
    if (checkCandidateProfile.logo !== null) {
      fs.unlink("data/" + checkCandidateProfile.logo, (err) => {
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

exports.uploadCV = async (req, res) => {
  const userId = req.params.userId;
  try {
    const filePath = req.files["cv"].path
      .replace("data\\", "")
      .replace("\\", "/");

    const checkCandidateProfile = await CandidateProfile.findOne({
      where: { userId: userId },
    });

    CandidateProfile.update(
      { cv: filePath },
      {
        where: { userId: userId },
      }
    );
    if (
      checkCandidateProfile.phoneNumber &&
      checkCandidateProfile.description
    ) {
      CandidateProfile.update(
        { status: "Complet" },
        {
          where: { userId: userId },
        }
      );
    }
    if (checkCandidateProfile.cv !== null) {
      fs.unlink("data/" + checkCandidateProfile.cv, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    // SUCCESS, CV successfully uploaded
    return res.send(filePath);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
