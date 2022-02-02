const db = require("../models");
const User = db.users;
const CompanyProfile = db.company_profiles;
const CandidateProfile = db.candidate_profiles;

const UserService = require("../services/user.service");
const MailService = require("../services/mail.service");
const PhaseService = require("../services/phase.service");
const bcrypt = require("bcrypt");
const { Sequelize } = require("../models");

require("dotenv").config();

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
    const password = await UserService.update(userId, email);
    // TODO Décommenter pour l'envoi des mails
    await MailService.sendAccountCreated(email, password);
    return res.send(`Utilisateur ${userId} mis à jour`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update a User password by the id in the request
exports.changePassword = async (req, res) => {
  const userId = req.params.userId;
  const { oldPassword, newPassword } = req.body;

  if (!(oldPassword && newPassword)) {
    return res
      .status(400)
      .send("Au moins un champ manquant (ancien mdp / nouveau mdp)");
  }

  //Check if user exists
  const checkUser = await User.findByPk(userId);
  if (!checkUser) {
    return res.status(404).send("Cet utilisateur n'existe pas");
  }

  try {
    const valid = await bcrypt.compare(oldPassword, checkUser.password);
    if (!valid) {
      return res.status(403).send("Mauvais mot de passe");
    }

    const hash = await bcrypt.hash(
      newPassword,
      parseInt(process.env.SALT_ROUNDS)
    );
    await User.update(
      { password: hash },
      {
        where: { id: userId },
      }
    );

    return res.send(`Mot de passe de l'utilisateur ${userId} mis à jour`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.resetPassword = async (req, res) => {
  const userId = req.params.userId;

  //Check if user exists
  const checkUser = await User.findByPk(userId);
  if (!checkUser) {
    return res.status(404).send("Cet utilisateur n'existe pas");
  }

  try {
    const password = await UserService.update(userId, checkUser.email);
    console.log("New password :", password);
    // TODO Décommenter pour l'envoi des mails
    await MailService.sendPswReset(checkUser.email, password);
    return res.send(`Mot de passe de l'utilisateur ${userId} réinitialisé`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.resetForgottenPassword = async (req, res) => {
  const email = req.body.email;

  //Check if user exists
  const checkUser = await User.findOne({ where: { email: email } });
  if (!checkUser) {
    return res.status(404).send("Email inconnu");
  }

  try {
    const password = await UserService.update(checkUser.id, checkUser.email);
    console.log("New password :", password);
    // TODO Décommenter pour l'envoi des mails
    await MailService.sendPswReset(checkUser.email, password);
    return res.send(
      `Mot de passe de l'utilisateur ${checkUser.id} réinitialisé`
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.sendRemindersCandidates = async (req, res) => {
  try {
    const phase = await PhaseService.getCurrentPhase();
    switch (phase.currentPhase) {
      case "INSCRIPTION":
        const lateCandidates = await CandidateProfile.findAll({
          where: {
            [Sequelize.Op.or]: [
              { phoneNumber: null },
              { description: null },
              { cv: null },
            ],
          },
          include: [{ model: User }],
        });

        await Promise.all(
          lateCandidates.map(async (candidate) => {
            console.log(candidate.user.email);
            await MailService.sendProfileReminderCandidates(candidate.user.email);
          })
        );
        break;
      case "VOEUX":
        const wishlessCandidates = await CandidateProfile.findAll({
          include: [{ model: User, attributes: ["id", "email"] }],
          attributes: [
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
          raw: true,
          nest: true,
        });

        await Promise.all(
          wishlessCandidates.map(async (candidate) => {
            if (candidate.wishesCount === 0) {
              console.log(candidate.user.email);
              await MailService.sendWishReminderCandidates(candidate.user.email);
            }
          })
        );
        break;
      default:
        return res.status(400).send("Pas de rappel prévu durant cette phase");
    }
    return res.send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.sendRemindersCompanies = async (req, res) => {
  try {
    const phase = await PhaseService.getCurrentPhase();
    switch (phase.currentPhase) {
      case "INSCRIPTION":
        const lateCompanies = await CompanyProfile.findAll({
          include: [{ model: User, attributes: ["id", "email"] }],
          attributes: [
            "phoneNumber",
            "description",
            [
              // Note the wrapping parentheses in the call below!
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

        await Promise.all(
          lateCompanies.map(async (company) => {
            if (
              !(
                company.phoneNumber &&
                company.description &&
                company.offersCount !== 0
              )
            ) {
              console.log(company.user.email);
              await MailService.sendProfileReminderCompanies(company.user.email);
            }
          })
        );
        break;
      case "VOEUX":
        const wishlessCompanies = await CompanyProfile.findAll({
          include: [{ model: User, attributes: ["id", "email"] }],
          attributes: [
            [
              Sequelize.literal(`(
            SELECT COUNT(*)
            FROM wish_companies AS wish_company
            WHERE
            wish_company.companyProfileId = company_profile.id
            )`),
              "wishesCount",
            ],
          ],
          raw: true,
          nest: true,
        });

        await Promise.all(
          wishlessCompanies.map(async (company) => {
            if (company.wishesCount === 0) {
              console.log(company.user.email);
              await MailService.sendWishReminderCompanies(company.user.email);
            }
          })
        );
        break;
      default:
        return res.status(400).send("Pas de rappel prévu durant cette phase");
    }
    return res.send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.sendSatisfactionSurvey = async (req, res) => {
  const surveyLink = req.body.surveyLink;
  if (!surveyLink) {
    return res.status(400).send("Le lien du questionnaire est manquant");
  }

  const candidatesAndCompanies = await User.findAll({
    where: {
      role: { [Sequelize.Op.or]: [User.ROLES.CANDIDATE, User.ROLES.COMPANY] },
    },
    raw: true,
  });

  await Promise.all(
    candidatesAndCompanies.map(async (user) => {
      await MailService.sendSatisfactionSurvey(surveyLink, user.email);
    })
  );
  return res.send("Mails envoyés");
};
