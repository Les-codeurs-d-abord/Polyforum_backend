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


// Update a User email by the id in the request
// It resets the password and send it to the new email
exports.update = async (req, res) => {
  const userId = req.params.userId;
  const email = req.body.email;

  if (!email) {
    return res.status(400).send("Champ email vide");
  }

  //Check if user already exists
  const checkUser = await User.findOne({ where: { email: email } });
  if (checkUser) {
    return res.status(409).send("Cet email est déjà utilisé");
  }

  try {
    password = await UserService.update(userId, email);
    // TODO Décommenter pour l'envoi des mails
    // await MailService.sendAccountCreated(email, password);
    return res.send(`Utilisateur ${userId} mis à jour`);
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
