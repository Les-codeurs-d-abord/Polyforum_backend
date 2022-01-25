var nodemailer = require("nodemailer");
const db = require("../models");
const CandidateProfile = db.candidate_profiles;
const CompanyProfile = db.company_profiles;
const User = db.users;
const { Sequelize } = require("../models");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.POLYFORUM_MAIL,
    pass: process.env.POLYFORUM_MAIL_PASSWORD,
  },
});

exports.sendProfileReminders = async () => {
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
      await exports.sendProfileReminderCandidates(candidate.user.email);
    })
  );

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

  // console.log(lateCompanies);

  await Promise.all(
    lateCompanies.map(async (company) => {
      if (
        !(
          company.phoneNumber &&
          company.description &&
          company.offersCount !== 0
        )
      ) {
        await exports.sendProfileReminderCompanies(company.user.email);
      }
    })
  );
};

exports.sendWishReminders = async () => {
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
        // await exports.sendWishReminderCandidates(candidate.user.email);
      }
    })
  );

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
        // await exports.sendWishReminderCompanies(company.user.email);
      }
    })
  );
};

exports.sendAccountCreated = async (address, password) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Inscription au forum", // Subject line
    html:
      "<h1>Bienvenue sur PolyForum !</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Vous avez été inscrit au forum d'entretiens apprentis / entreprises de Polytech Lyon.</p>" +
      "<p>Vous pouvez dès à présent vous connecter à l'adresse 'insérer adresse' et compléter votre profil avec vos identifiants :</p>" +
      "<div>" +
      "<ul>Nom d'utilisateur : " +
      address +
      "</ul>" +
      "<ul>Mot de passe : " +
      password +
      "</ul>" +
      "</div>" +
      "<p>Nous vous conseillons de changer votre mot de passe dès votre première connexion.</p>" +
      "<p>À bientôt sur PolyForum !</p>" +
      '<table id="footer" style="height: auto; width: 100%;">' +
      "<tbody>" +
      "<tr>" +
      '<td  style="width: 50%; text-align: center;">' +
      '<img src="http://localhost:8080/api/res/icons/logo_png.png" style="margin-left: 20px; width: 200px; height: 200px;">' +
      "</td>" +
      '<td style="width: 50%;">' +
      '<div style="border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption">' +
      '<div style="margin-left: 10px; font-weight: bold;">' +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>",
    // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendPswReset = async (address, password) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Réinitialisation du mot de passe", // Subject line
    html:
      "<h1>Changement de mot de passe</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Nous vous confirmons que votre mot de passe a bien été réinitialisé.</p>" +
      "<p>Voici votre nouveau mot de passe : " +
      password +
      "</p>" +
      "<p>À bientôt sur PolyForum !</p>" +
      '<table id="footer" style="height: auto; width: 100%;">' +
      "<tbody>" +
      "<tr>" +
      '<td  style="width: 50%; text-align: center;">' +
      '<img src="http://localhost:8080/api/res/icons/logo_png.png" style="margin-left: 20px; width: 200px; height: 200px;">' +
      "</td>" +
      '<td style="width: 50%;">' +
      '<div style="border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption">' +
      '<div style="margin-left: 10px; font-weight: bold;">' +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>",
    // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendProfileReminderCandidates = async (address) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Rappel : il vous reste des champs à renseigner", // Subject line
    html:
      "<h1>Profil incomplet</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Pour rappel, il vous reste des champs à renseigner dans votre profil avant la clôture des saisies.</p>" +
      "<p>Vérifiez que vous avez bien téléchargé votre <b>CV</b> et complété les informations complémentaires.</p>" +
      "<p>À bientôt sur PolyForum !</p>" +
      '<table id="footer" style="height: auto; width: 100%;">' +
      "<tbody>" +
      "<tr>" +
      '<td  style="width: 50%; text-align: center;">' +
      '<img src="http://localhost:8080/api/res/icons/logo_png.png" style="margin-left: 20px; width: 200px; height: 200px;">' +
      "</td>" +
      '<td style="width: 50%;">' +
      '<div style="border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption">' +
      '<div style="margin-left: 10px; font-weight: bold;">' +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>",
    // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendProfileReminderCompanies = async (address) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Rappel : il vous reste des champs à renseigner", // Subject line
    html:
      "<h1>Profil incomplet</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Pour rappel, il vous reste des champs à renseigner dans votre profil avant la clôture des saisies.</p>" +
      "<p>Vérifiez que vous avez bien publié des <b>offres</b> et complété les informations complémentaires.</p>" +
      "<p>À bientôt sur PolyForum !</p>" +
      '<table id="footer" style="height: auto; width: 100%;">' +
      "<tbody>" +
      "<tr>" +
      '<td  style="width: 50%; text-align: center;">' +
      '<img src="http://localhost:8080/api/res/icons/logo_png.png" style="margin-left: 20px; width: 200px; height: 200px;">' +
      "</td>" +
      '<td style="width: 50%;">' +
      '<div style="border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption">' +
      '<div style="margin-left: 10px; font-weight: bold;">' +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>",
    // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendWishReminderCandidates = async (address) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Rappel : vous n'avez pas encore fait de voeux", // Subject line
    html:
      "<h1>Vous n'avez pas encore fait de voeux</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Pour rappel, il faut impérativement que vous choisissiez des entreprises à rencontrer, pour accéder à la suite du forum.</p>" +
      "<p>Vous pouvez consulter les différentes offres disponibles, ajouter et classer celles qui vous intéressent dans votre liste de voeux.</p>" +
      "<p>À bientôt sur PolyForum !</p>" +
      '<table id="footer" style="height: auto; width: 100%;">' +
      "<tbody>" +
      "<tr>" +
      '<td  style="width: 50%; text-align: center;">' +
      '<img src="http://localhost:8080/api/res/icons/logo_png.png" style="margin-left: 20px; width: 200px; height: 200px;">' +
      "</td>" +
      '<td style="width: 50%;">' +
      '<div style="border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption">' +
      '<div style="margin-left: 10px; font-weight: bold;">' +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>",
    // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendWishReminderCompanies = async (address) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Rappel : vous n'avez pas encore fait de voeux", // Subject line
    html:
      "<h1>Vous n'avez pas encore fait de voeux</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Pour rappel, il faut impérativement que vous choisissiez des candidat·es à rencontrer, pour accéder à la suite du forum.</p>" +
      "<p>Vous pouvez consulter les profils des différent·es candidat·es disponibles, ajouter et classer ceux qui vous intéressent dans votre liste de voeux.</p>" +
      "<p>À bientôt sur PolyForum !</p>" +
      '<table id="footer" style="height: auto; width: 100%;">' +
      "<tbody>" +
      "<tr>" +
      '<td  style="width: 50%; text-align: center;">' +
      '<img src="http://localhost:8080/api/res/icons/logo_png.png" style="margin-left: 20px; width: 200px; height: 200px;">' +
      "</td>" +
      '<td style="width: 50%;">' +
      '<div style="border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption">' +
      '<div style="margin-left: 10px; font-weight: bold;">' +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>",
    // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
