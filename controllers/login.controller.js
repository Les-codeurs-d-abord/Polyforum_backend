require("dotenv").config();

const db = require("../models");
const User = db.users;
const CandidateProfile = db.candidate_profiles;
const CandidateLink = db.candidate_links;
const CandidateTag = db.candidate_tags;
const CompanyProfile = db.company_profiles;
const CompanyLink = db.company_links;

var jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

exports.getToken = async (req, res) => {
  const { email, password } = req.body;

  console.log("GetToken: " + email + "pwd: " + password);

  if (!email || !password) {
    return res.status(401).send("Email or password empty.");
  }

  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Unknown user." });
      }

      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Wrong password." });
          }

          var payload = {
            email: user.email,
            role: user.role,
            id: user.id,
          };

          if (user.role === User.ROLES.CANDIDATE) {
            CandidateProfile.update(
              { status: "Incomplet" },
              { where: { userId: user.id, status: "Jamais connecté" } }
            ).catch((error) => res.status(500).json({ error }));
            CandidateProfile.findOne({
              where: { userId: user.id },
              raw: true,
            }).then((value) => {
              console.log(value.id);
              payload.candidateProfileId = value.id;
              res.status(200).json({
                payload,
                token: jwt.sign(payload, process.env.JWT_KEY, {
                  algorithm: "HS256",
                  expiresIn: "24h",
                }),
              });
            });
          } else if (user.role === User.ROLES.COMPANY) {
            CompanyProfile.update(
              { status: "Incomplet" },
              { where: { userId: user.id, status: "Jamais connecté" } }
            ).catch((error) => res.status(500).json({ error }));
            CompanyProfile.findOne({
              where: { userId: user.id },
              raw: true,
            }).then((value) => {
              console.log(value.id);
              payload.companyProfileId = value.id;
              res.status(200).json({
                payload,
                token: jwt.sign(payload, process.env.JWT_KEY, {
                  algorithm: "HS256",
                  expiresIn: "24h",
                }),
              });
            });
          } else {
            res.status(200).json({
              payload,
              token: jwt.sign(payload, process.env.JWT_KEY, {
                algorithm: "HS256",
                expiresIn: "24h",
              }),
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getUserFromToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (decoded.role === User.ROLES.CANDIDATE) {
      try {
        const candidate_profile = await CandidateProfile.findOne({
          where: { userId: decoded.id },
          include: [
            {
              model: User,
              attributes: ["id", "email", "role"],
            },
            { model: CandidateLink },
            { model: CandidateTag },
          ],
        });
        if (!candidate_profile) {
          return res.status(404).send("Pas de candidat trouvé");
        }
        return res.send(candidate_profile);
      } catch (err) {
        return res.status(500).send(err.message);
      }
    } else if (decoded.role === User.ROLES.COMPANY) {
      try {
        const company_profile = await CompanyProfile.findOne({
          where: { userId: decoded.id },
          include: [
            {
              model: User,
              attributes: ["id", "email", "role"],
            },
            { model: CompanyLink },
          ],
        });
        if (!company_profile) {
          return res.status(404).send("Pas d'entreprise trouvée");
        }
        return res.send(company_profile);
      } catch (err) {
        return res.status(500).send(err.message);
      }
    } else if (decoded.role === User.ROLES.ADMIN) {
      try {
        const admin_profile = await User.findOne({
          where: { id: decoded.id },
          attributes: ["id", "email", "role"],
        });
        if (!admin_profile) {
          return res.status(404).send("Pas d'admin trouvé");
        }
        return res.send({ user: admin_profile });
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }

    return res.status(500).send("Une erreur est survenue.");
  });
};

exports.checkTokenValidity = async (req, res) => {
  return res.status(200).send("Token valide.");
};
