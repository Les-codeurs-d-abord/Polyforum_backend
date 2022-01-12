const db = require("../models");
const User = db.users;

const UserService = require("../services/user.service");


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
