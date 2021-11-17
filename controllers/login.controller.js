const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
const KEY = "HSNDKAJZRIWKNARHSKXH";

const bcrypt = require('bcrypt');

exports.getToken = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email or password empty.");
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Unknow user." });
      }
      bcrypt.compare(password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Wrong password." });
          }

          var payload = {
            email: user.email,
          };

          res.status(200).json({
            email: user.email,
            token: jwt.sign(
              payload,
              KEY,
              { algorithm: "HS256", expiresIn: "24h" }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.removeToken = async (req, res) => {
  return res.status(200).send("WIP - Remove token.");
};