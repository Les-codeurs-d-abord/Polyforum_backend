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

exports.sendSatisfactionSurvey = async (surveyLink, address) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Questionaire de satisfaction", // Subject line
    html:
      "<h1>Qu'avez vous pensé du forum ?</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Suite à l'utilisation du forum, nous souhaiterions avoir votre avis sur les points à améliorer pour le futur</p>" +
      '<p>En cliquant sur <a href="' +
      surveyLink +
      '">ce lien</a>, vous accéderez à un rapide questionnaire à compléter</p>' +
      "<p>Merci et bonne journée !</p>" +
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

exports.sendWishPhase = async (address) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Passage à la phase de voeux", // Subject line
    html:
      "<h1>Passage à la phase de voeux</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Nous vous informons que le forum passe en phase de voeux.</p>" +
      "<p>Vous ne pouvez plus modifier votre profil, vous pouvez réaliser des voeux de rencontre et les organiser.</p>" +
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

exports.sendPlanningPhase = async (address) => {
  const mailOptions = {
    from: '"Polyforum" <' + process.env.POLYFORUM_MAIL + ">", // sender address
    to: address, // list of receivers
    subject: "Planning disponible", // Subject line
    html:
      "<h1>Votre planning de rencontre est disponible</h1>" +
      "<p>Bonjour,</p>" +
      "<p>Nous vous informons que votre planning de rencontre est diponible.</p>" +
      "<p>Vous ne pouvez plus modifier vos voeux, et vous pouvez voir les rencontres prévues dans l'onglet \"Planning\".</p>" +
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
