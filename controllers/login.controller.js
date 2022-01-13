require('dotenv').config();

const db = require("../models");
const User = db.users;

var jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

exports.getToken = async (req, res) => {
  const { email, password } = req.body;

  console.log("GetToken: " + email + "pwd: " + password);

  if (!email || !password) {
    return res.status(401).send("Email or password empty.");
  }

  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Unknown user." });
      }

      bcrypt.compare(password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Wrong password." });
          }

          var payload = {
            email: user.email,
            role: user.role,
            id: user.id,
          };

          res.status(200).json({
            payload,
            token: jwt.sign(
              payload,
              process.env.JWT_KEY,
              { algorithm: "HS256", expiresIn: "24h" }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.checkTokenValidity = async (req, res) => {
  return res.status(200).send("Token valide.");
};