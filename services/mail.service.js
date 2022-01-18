var nodemailer = require("nodemailer");
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
      "<p>Bonjour,</p>"+
      "<p>Vous avez été inscrit au forum d'entretiens apprentis / entreprises de Polytech Lyon.</p>" +
      "<p>Vous pouvez dès à présent vous connecter à l'adresse 'insérer adresse' et compléter votre profil avec vos identifiants :</p>" +
      "<div>"+
      "<ul>Nom d'utilisateur : " + address + "</ul>" + 
      "<ul>Mot de passe : " + password + "</ul>" +
      "</div>" +
      "<p>Nous vous conseillons de changer votre mot de passe dès votre première connexion.</p>" +
      "<p>À bientôt sur PolyForum !</p>" +
      "<table id=\"footer\" style=\"height: auto; width: 100%;\">" +
      "<tbody>" +
      "<tr>" +
      "<td  style=\"width: 50%; text-align: center;\">" +
      "<img src=\"http://localhost:8080/api/res/icons/logo_png.png\" style=\"margin-left: 20px; width: 200px; height: 200px;\">" +
      "</td>" +
      "<td style=\"width: 50%;\">" +
      "<div style=\"border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption\">" +
      "<div style=\"margin-left: 10px; font-weight: bold;\">" +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" 
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
      "<table id=\"footer\" style=\"height: auto; width: 100%;\">" +
      "<tbody>" +
      "<tr>" +
      "<td  style=\"width: 50%; text-align: center;\">" +
      "<img src=\"http://localhost:8080/api/res/icons/logo_png.png\" style=\"margin-left: 20px; width: 200px; height: 200px;\">" +
      "</td>" +
      "<td style=\"width: 50%;\">" +
      "<div style=\"border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption\">" +
      "<div style=\"margin-left: 10px; font-weight: bold;\">" +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" 
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

exports.sendReminderCandidates = async (address) => {
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
      "<table id=\"footer\" style=\"height: auto; width: 100%;\">" +
      "<tbody>" +
      "<tr>" +
      "<td  style=\"width: 50%; text-align: center;\">" +
      "<img src=\"http://localhost:8080/api/res/icons/logo_png.png\" style=\"margin-left: 20px; width: 200px; height: 200px;\">" +
      "</td>" +
      "<td style=\"width: 50%;\">" +
      "<div style=\"border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption\">" +
      "<div style=\"margin-left: 10px; font-weight: bold;\">" +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" 
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

exports.sendReminderCompanies = async (address) => {
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
      "<table id=\"footer\" style=\"height: auto; width: 100%;\">" +
      "<tbody>" +
      "<tr>" +
      "<td  style=\"width: 50%; text-align: center;\">" +
      "<img src=\"http://localhost:8080/api/res/icons/logo_png.png\" style=\"margin-left: 20px; width: 200px; height: 200px;\">" +
      "</td>" +
      "<td style=\"width: 50%;\">" +
      "<div style=\"border-left: 3px solid black; height: 100px; left: 50%; margin-left: -3px; top: 0; display: table-caption\">" +
      "<div style=\"margin-left: 10px; font-weight: bold;\">" +
      "<p>L'équipe PolyForum</p>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" 
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