require('dotenv').config();

const db = require("../models");
const User = db.users;
const CandidateProfile = db.candidate_profiles;

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

exports.getUserFromToken = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if(decoded.role === User.ROLES.CANDIDATE) {
      try {
        const candidate_profile = await CandidateProfile.findAll({
          where: { userId: decoded.id },
          include: [
            {
              model: User,
              attributes: ["id", "email", "role"],
            },
          ],
        });
        if (!candidate_profile.length) {
          return res.status(404).send("Pas de candidat trouvé");
        }
        return res.send(candidate_profile[0]);
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }
    else if(decoded.role === User.ROLES.COMPANY) {
      try {
        const company_profile = await CompanyProfile.findAll({
          where: { userId: decoded.id },
          include: [
            {
              model: User,
              attributes: ["id", "email", "role"],
            },
          ],
        });
        if (!company_profile.length) {
          return res.status(404).send("Pas d'entreprise trouvée");
        }
        return res.send(company_profile[0]);
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }
    else if(decoded.role === User.ROLES.ADMIN) {

    }

    return res.status(500).send("Une erreur est survenue.");
  });
};

exports.checkTokenValidity = async (req, res) => {
  return res.status(200).send("Token valide.");
};