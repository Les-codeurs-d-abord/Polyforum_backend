var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // TODO: remplacer par une adresse dédié
    user: "remipailharey@gmail.com",
    pass: "hhwxvdzhqsqjylsw",
  }
});

exports.sendAccountCreated = async (address, password) => {
  const mailOptions = {
    from: '"Rémi P" <remipailharey@gmail.com>', // sender address
    to: address, // list of receivers
    subject: "Sending mail with Node.js", // Subject line
    text: "Password : " + password, // plain text body
    html: "<p>Password : " + password + "</p>", // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
};
