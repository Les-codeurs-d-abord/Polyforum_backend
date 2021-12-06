const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
const KEY = "HSNDKAJZRIWKNARHSKXH";

const bcrypt = require('bcrypt');

exports.getInfo = async (req, res) => {
  console.log("info");
  const { email, password } = req.body;
  console.log(req.body);
  return res.status(200).send("Get info ok !");
};

exports.getToken = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  console.log("GeToken: " + email + password);

  if (!email || !password) {
    return res.status(400).send("Email or password empty.");
  }

  User.findOne({ where: { email: req.body.email } })
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