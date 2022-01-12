const db = require("../models");
const User = db.users;
const CandidateProfile = db.candidate_profiles;

const UserService = require("../services/user.service");
const CandidateProfileService = require("../services/candidate_profile.service");
const MailService = require("../services/mail.service");

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
    // TODO Décommenter pour l'envoi des mails
    // await MailService.sendAccountCreated(user.email, password);

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

// Find a single candidate with an id
exports.findById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const candidate_profile = await CandidateProfile.findAll({
      where: { userId: userId },
      include: [
        {
          model: User,
          attributes: ["id", "email"],
        },
      ],
    });
    if (!candidate_profile.length) {
      return res.status(404).send("Pas d'entreprise trouvée");
    }
    return res.send(candidate_profile[0]);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete a single candidate with an id
exports.deleteById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const profileDeleted = await CandidateProfile.destroy({
      where: { userId: userId },
    });

    await User.destroy({
      where: { userId: userId },
    });

    if (profileDeleted) {
      // Profile deleted
      return res.status(200).send("Candidat supprimé");
    } else {
      // Profile not found
      return res.status(404).send("Pas de candidat trouvé");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update a User by the id in the request
exports.updateCandidateProfile = async (req, res) => {
  const userId = req.params.userId;
  const updateContent = {
    candidateName: req.body.candidateName,
    phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : null,
    description: req.body.description ? req.body.description : null,
  };

  if (!updateContent.candidateName) {
    return res
      .status(400)
      .send(
        "Au moins un champ manquant (raison sociale / téléphone / description)"
      );
  }

  //Check if this candidate profile exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCandidateProfile) {
    return res.status(409).send("Ce profil d'entreprise n'existe pas");
  }

  try {
    await CandidateProfile.update(updateContent, {
      where: { userId: userId },
    });
    return res.send(`Profil d'entreprise ${userId} mis à jour`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


