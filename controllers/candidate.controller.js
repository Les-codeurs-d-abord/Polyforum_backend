const db = require("../models");
const User = db.users;
const CandidateProfile = db.candidate_profiles;
const CandidateLink = db.candidate_links;
const CandidateTag = db.candidate_tags;
const Tag = db.tags;

const UserService = require("../services/user.service");
const CandidateProfileService = require("../services/candidate_profile.service");
const MailService = require("../services/mail.service");

const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Create a candidate
exports.createCandidate = async (req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!(email && firstName && lastName)) {
    return res
      .status(400)
      .send("Au moins un champ manquant (email / nom / prénom)");
  }

  //Check if user already exists
  const checkUser = await User.findOne({ where: { email: email } });
  if (checkUser) {
    return res.status(409).send("Cet email est déjà utilisé");
  }

  //Check if candidate profile already exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { firstName: firstName, lastName: lastName },
  });
  if (checkCandidateProfile) {
    return res.status(409).send("Ce candidat est déjà inscrit");
  }

  try {
    const { user, password } = await UserService.createUser(
      email,
      User.ROLES.CANDIDATE
    );
    console.log("Candidate created : ", user.toJSON());
    const candidateProfile =
      await CandidateProfileService.createCandidateProfile(
        user.id,
        firstName,
        lastName
      );
    console.log("Candidate profile created : ", candidateProfile.toJSON());
    console.log(password);
    // TODO Décommenter pour l'envoi des mails
    // await MailService.sendAccountCreated(user.email, password);

    return res.status(201).send("Candidat créé avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// List all candidates
exports.candidateList = async (req, res) => {
  try {
    const candidate_profiles = await CandidateProfile.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "email"],
        },
        { model: CandidateLink },
        {
          model: CandidateTag,
          include: [
            {
              model: Tag,
              attributes: ["id", "label"],
            },
          ],
        },
      ],
      attributes: ["firstName", "lastName"],
    });
    return res.send(candidate_profiles);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find a single candidate with an id
exports.findById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const candidate_profile = await CandidateProfile.findAll({
      where: { userId: userId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
        },
        { model: CandidateLink },
        {
          model: CandidateTag,
          include: [
            {
              model: Tag,
              attributes: ["id", "label"],
            },
          ],
        },
      ],
    });
    if (!candidate_profile.length) {
      return res.status(404).send("Pas de candidat trouvée");
    }
    return res.send(candidate_profile[0]);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete a single candidate with an id
exports.deleteById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const profileDeleted = await CandidateProfile.destroy({
      where: { userId: userId },
    });

    await User.destroy({
      where: { userId: userId },
    });

    if (profileDeleted) {
      // Profile deleted
      return res.status(200).send("Candidat supprimé");
    } else {
      // Profile not found
      return res.status(404).send("Pas de candidat trouvé");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update a User by the id in the request
exports.updateCandidateProfile = async (req, res) => {
  const userId = req.params.userId;
  const updateContent = {
    candidateName: req.body.candidateName,
    phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : null,
    description: req.body.description ? req.body.description : null,
  };

  if (!updateContent.candidateName) {
    return res
      .status(400)
      .send(
        "Au moins un champ manquant (raison sociale / téléphone / description)"
      );
  }

  //Check if this candidate profile exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCandidateProfile) {
    return res.status(409).send("Ce profil de candidat n'existe pas");
  }

  try {
    await CandidateProfile.update(updateContent, {
      where: { userId: userId },
    });
    return res.send(`Profil d'entreprise ${userId} mis à jour`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.uploadLogo = async (req, res) => {
  const userId = req.params.userId;

  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });

  if(!checkCandidateProfile) {
    return res.status(404).send("Ce candidat n'existe pas")
  }

  let deleteOldLogo = false;
  let extension = "";

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, "data/candidateLogos");
    },
    filename: function (req, file, cb) {
      extension = file.originalname.split(".")[1];
      deleteOldLogo = checkCandidateProfile.logo
        ? extension != checkCandidateProfile.logo.split(".")[1]
        : false;
      cb(null, "candidateLogo_" + userId + "." + extension);
    },
  });

  // Define the maximum size for uploading
  // picture i.e. 4 MB. it is optional
  const maxSize = 4 * 1000 * 1000;

  var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
      // Set the filetypes, it is optional
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);

      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }

      cb(
        "Error: File upload only supports the " +
          "following filetypes - " +
          filetypes
      );
    },

    // logo is the name of file attribute
  }).single("logo");

  upload(req, res, function (err) {
    if (err) {
      // ERROR occured (here it can be occured due
      // to uploading image of size greater than
      // 1MB or uploading different file type)
      res.status(400).send(err);
    } else {
      // update logo in candidate profile
      CandidateProfile.update(
        { logo: "candidateLogo_" + userId + "." + extension },
        {
          where: { userId: userId },
        }
      );
      if (deleteOldLogo) {
        fs.unlink("data/candidateLogos/" + checkCandidateProfile.logo, (err) => {
          if (err) {
            console.error(err);
            return;
          }

          //file removed
        });
      }
      // SUCCESS, image successfully uploaded
      res.send("Success, Image uploaded!");
    }
  });
};

exports.uploadCV = async (req, res) => {
  const userId = req.params.userId;

  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });

  if(!checkCandidateProfile) {
    return res.status(404).send("Ce candidat n'existe pas")
  }

  let deleteOldCV = false;
  let extension = "";

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, "data/candidateCV");
    },
    filename: function (req, file, cb) {
      extension = file.originalname.split(".")[1];
      console.log(extension)
      deleteOldLogo = checkCandidateProfile.logo
        ? extension != checkCandidateProfile.logo.split(".")[1]
        : false;
      cb(null, "candidateCV_" + userId + "." + extension);
    },
  });

  // Define the maximum size for uploading
  // picture i.e. 4 MB. it is optional
  const maxSize = 4 * 1000 * 1000;

  var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
      // Set the filetypes, it is optional
      var filetypes = /pdf|doc|docx/;
      var mimetype = filetypes.test(file.mimetype);

      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }

      cb(
        "Error: File upload only supports the " +
          "following filetypes - " +
          filetypes
      );
    },

    // logo is the name of file attribute
  }).single("cv");

  upload(req, res, function (err) {
    if (err) {
      // ERROR occured (here it can be occured due
      // to uploading image of size greater than
      // 1MB or uploading different file type)
      res.status(400).send(err);
    } else {
      // update cv in candidate profile
      CandidateProfile.update(
        { cv: "candidateCV_" + userId + "." + extension },
        {
          where: { userId: userId },
        }
      );
      if (deleteOldLogo) {
        fs.unlink("data/candidateCV/" + checkCandidateProfile.cv, (err) => {
          if (err) {
            console.error(err);
            return;
          }

          //file removed
        });
      }
      // SUCCESS, CV successfully uploaded
      res.send("Success, CV uploaded!");
    }
  });
};

exports.addLink = async (req, res) => {
  const userId = req.params.userId;
  const label = req.body.label;

  if (!label) {
    return res.status(400).send("Le lien est manquant");
  }

  //Check if this candidate profile exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCandidateProfile) {
    return res.status(409).send("Ce profil de candidat n'existe pas");
  }

  try {
    const linkData = {
      label: label,
      candidateProfileId: checkCandidateProfile.id,
    };
    await CandidateLink.create(linkData);
    res.send("Lien de candidat ajouté");
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.linksList = async (req, res) => {
  const userId = req.params.userId;

  //Check if this candidate profile exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCandidateProfile) {
    return res.status(409).send("Ce profil de candidat n'existe pas");
  }

  try {
    const candidate_links = await CandidateLink.findAll({
      where: { candidateProfileId: checkCandidateProfile.id },
    });
    return res.send(candidate_links);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete a single candidate link with an id
exports.deleteLinkById = async (req, res) => {
  const linkId = req.params.linkId;

  try {
    const linkDeleted = await CandidateLink.destroy({
      where: { id: linkId },
    });

    if (linkDeleted) {
      // Link deleted
      return res.status(200).send("Lien de candidat supprimé");
    } else {
      // Link not found
      return res.status(404).send("Pas de lien de candidat trouvé");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.addTag = async (req, res) => {
  const userId = req.params.userId;
  const tagLabel = req.body.label;

  if (!tagLabel) {
    return res.status(400).send("Le tag est manquant");
  }

  //Check if this candidate profile exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCandidateProfile) {
    return res.status(409).send("Ce profil de candidat n'existe pas");
  }

  //Check if this tag exists
  let tag = await Tag.findOne({
    where: { label: tagLabel },
  });

  try {
    // If this tag doesn't exist, create it
    if (!tag) {
      tag = await Tag.create({ label: tagLabel });
    }

    // Check if the candidate already has this tag
    let checkAlreadyHasTag = await CandidateTag.findOne({
      where: { candidateProfileId: checkCandidateProfile.id, tagId: tag.id },
    });
    if (checkAlreadyHasTag) {
      return res.status(409).send("Ce candidat a déjà ce tag");
    }

    const tagData = {
      tagId: tag.id,
      candidateProfileId: checkCandidateProfile.id,
    };
    await CandidateTag.create(tagData);
    res.send("Tag de candidat ajouté");
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.tagsList = async (req, res) => {
  const userId = req.params.userId;

  //Check if this candidate profile exists
  const checkCandidateProfile = await CandidateProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCandidateProfile) {
    return res.status(409).send("Ce profil de candidat n'existe pas");
  }

  try {
    const candidate_tags = await CandidateTag.findAll({
      where: { candidateProfileId: checkCandidateProfile.id },
      include: [
        {
          model: Tag,
          attributes: ["id", "label"],
        },
      ],
      attributes: { exclude: ["candidateProfileId", "tagId"] },
    });
    return res.send(candidate_tags);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete a single candidate link with an id
exports.deleteTagById = async (req, res) => {
  const candidateTagId = req.params.candidateTagId;

  try {
    const tagDeleted = await CandidateTag.destroy({
      where: { id: candidateTagId },
    });

    if (tagDeleted) {
      // Link deleted
      return res.status(200).send("Tag de candidat supprimé");
    } else {
      // Link not found
      return res.status(404).send("Pas de tag de candidat trouvé");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
