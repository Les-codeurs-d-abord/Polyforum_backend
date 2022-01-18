const db = require("../models");
const User = db.users;

const UserService = require("../services/user.service");
const bcrypt = require("bcrypt");

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
    // await MailService.sendAccountCreated(email, password);
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
    return res.status(400).send("All input is required");
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

    const hash = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));
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

exports.resetPassword = async(req, res) => {
  const userId = req.params.userId;

  //Check if user exists
  const checkUser = await User.findByPk(userId);
  if (!checkUser) {
    return res.status(404).send("Cet utilisateur n'existe pas");
  }

  try {
    const password = await UserService.update(userId, checkUser.email);
    console.log("New password :", password)
    // TODO Décommenter pour l'envoi des mails
    // await MailService.sendAccountCreated(checkUser.email, password);
    return res.send(`Mot de passe de l'utilisateur ${userId} réinitialisé`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

// Create an admin User
exports.createAdmin = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send("Au moins un champ manquant (email)");
  }

  //Check if user already exists
  const checkUser = await User.findOne({ where: { email: email } });
  if (checkUser) {
    return res.status(409).send("Cet email est déjà utilisé");
  }

  try {
    const { user, password } = await UserService.createUser(
      email,
      User.ROLES.ADMIN
    );
    console.log("Admin created : ", user.toJSON());
    console.log("Mot de passe de l'admin : ", password);

    return res.status(201).send("Admin créé avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find user by id
exports.findById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).send("Ce user n'existe pas");
    }
    return res.send(user.toJSON());
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find all admins
exports.findAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: User.ROLES.ADMIN },
      attributes: { exclude: ["password"] },
    });
    return res.send(admins);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
