const db = require("../models");
const User = db.users;
const CompanyProfile = db.company_profiles;

const UserService = require("../services/user.service");
const CompanyProfileService = require("../services/company_profile.service");
const MailService = require("../services/mail.service");

const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Create a company
exports.createCompany = async (req, res) => {
  const email = req.body.email;
  const companyName = req.body.companyName;

  if (!(email && companyName)) {
    return res
      .status(400)
      .send("Au moins un champ manquant (email / raison sociale)");
  }

  //Check if user already exists
  const checkUser = await User.findOne({ where: { email: email } });
  if (checkUser) {
    return res.status(409).send("Cet email est déjà utilisé");
  }

  //Check if company profile already exists
  const checkCompanyProfile = await CompanyProfile.findOne({
    where: { companyName: companyName },
  });
  if (checkCompanyProfile) {
    return res.status(409).send("Cette entreprise est déjà inscrite");
  }

  try {
    const { user, password } = await UserService.createUser(
      email,
      User.ROLES.COMPANY
    );
    // console.log("Company created : ", user.toJSON())
    const companyProfile = await CompanyProfileService.createCompanyProfile(
      user.id,
      companyName
    );
    // console.log("Company profile created : ", companyProfile.toJSON())
    // TODO Décommenter pour l'envoi des mails
    // await MailService.sendAccountCreated(user.email, password);

    console.log(password);

    return res.status(201).send("Entreprise créée avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Find a single company with an id
exports.findById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const company_profile = await CompanyProfile.findAll({
      where: { userId: userId },
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
};

// Delete a single company with an id
exports.deleteById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const profileDeleted = await CompanyProfile.destroy({
      where: { userId: userId },
    });

    await User.destroy({
      where: { id: userId },
    });

    if (profileDeleted) {
      // Profile deleted
      return res.status(200).send("Entreprise supprimée");
    } else {
      // Profile not found
      return res.status(404).send("Pas d'entreprise trouvée");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update a User by the id in the request
exports.updateCompanyProfile = async (req, res) => {
  const userId = req.params.userId;
  const updateContent = {
    companyName: req.body.companyName,
    phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : null,
    description: req.body.description ? req.body.description : null,
  };

  if (!updateContent.companyName) {
    return res
      .status(400)
      .send(
        "Au moins un champ manquant (raison sociale / téléphone / description)"
      );
  }

  //Check if this company profile exists
  const checkCompanyProfile = await CompanyProfile.findOne({
    where: { userId: userId },
  });
  if (!checkCompanyProfile) {
    return res.status(409).send("Ce profil d'entreprise n'existe pas");
  }

  try {
    await CompanyProfile.update(updateContent, {
      where: { userid: userId },
    });
    return res.send(`Profil d'entreprise ${userId} mis à jour`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


exports.companyList = async (req, res) => {
  try {
    const company_profiles = await CompanyProfile.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "email"],
        },
      ],
      attributes: ["companyName", "logo"],
    });
    return res.send(company_profiles);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.uploadLogo = async (req, res) => {
  const userId = req.params.userId;

  const checkCompanyProfile = await CompanyProfile.findOne({
    where: { userId: userId },
  });

  if(!checkCompanyProfile) {
    return res.status(404).send("Cette entreprise n'existe pas")
  }

  let deleteOldLogo = false;
  let extension = "";

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, "data/companyLogos");
    },
    filename: function (req, file, cb) {
      extension = file.originalname.split(".")[1];
      deleteOldLogo = checkCompanyProfile.logo
        ? extension != checkCompanyProfile.logo.split(".")[1]
        : false;
      cb(null, "companyLogo_" + userId + "." + extension);
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
      // update logo in company profile
      CompanyProfile.update(
        { logo: "companyLogo_" + userId + "." + extension },
        {
          where: { userId: userId },
        }
      );
      if (deleteOldLogo) {
        fs.unlink("data/companyLogos/" + checkCompanyProfile.logo, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
      // SUCCESS, image successfully uploaded
      res.send("Success, Image uploaded!");
    }
  });
};
