const db = require("../models");
const User = db.users;

const bcrypt = require("bcrypt");

require("dotenv").config();

exports.createUser = async (email, role) => {
  // TODO: Générer un "vrai" mot de passe
  const password = exports.generatePassword();

  try {
    console.log(process.env.SALT_ROUNDS)
    const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    const userData = {
      email: email,
      password: hash,
      role: role,
    };
    const user = await User.create(userData);
    return { user, password };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.update = async (userId, email) => {
  try {
    const password = exports.generatePassword();
    console.log(password);
    const hash = await bcrypt.hash(password, saltRounds);
    await User.update(
      { email: email, password: hash },
      { where: { id: userId } }
    );
    return password;
  } catch (err) {
    throw err;
  }
};

exports.generatePassword = function () {
  var chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var password = "";

  for (var i = 0; i <= process.env.PASSWORD_LENGTH; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
};
