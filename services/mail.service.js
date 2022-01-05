var nodemailer = require("nodemailer");
require('dotenv').config();

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
    subject: "Sending mail with Node.js", // Subject line
    text: "Password : " + password, // plain text body
    html: "<p>Password : " + password + "</p>", // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
