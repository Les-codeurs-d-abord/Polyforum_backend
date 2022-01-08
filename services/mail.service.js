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
    text:
      "Bienvenue !\n" +
      "Vous avez été bien inscrit au forum de rencontre apprentis/entreprises organisé par Polytech Lyon !\n" +
      "Vous pouvez maintenant vous rendre sur ce site et vous connecter avec comme identifiant votre adresse mail et comme mot de pase provisoire : " +
      password +
      "\n" +
      "Nous vous invitons à modifer ce-dernier lors de votre première connexion\n" +
      "Bonne journée !", // plain text body
    html:
      "<h1>Bienvenue !</h1>" +
      "<p>Vous avez été bien inscrit au forum de rencontre apprentis/entreprises organisé par Polytech Lyon !</p>" +
      "<p>Vous pouvez maintenant vous rendre sur ce site et vous connecter avec comme identifiant votre adresse mail et comme mot de pase provisoire : " +
      password +
      "</p>" +
      "<p>Nous vous invitons à modifer ce-dernier lors de votre première connexion </p>" +
      "<p>Bonne journée !</p>", // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
