const db = require("../models");
const Phase = db.phase;
const User = db.users;
const MailService = require("../services/mail.service");
const { Sequelize } = require("../models");



// Set forum phase to INSCRIPTION
exports.setInscriptionPhase = async () => {
  const existingPhase = await Phase.findOne({ where: {} });
  if (!existingPhase) {
    Phase.create({ currentPhase: "INSCRIPTION" })
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  }
  Phase.update({ currentPhase: "INSCRIPTION" }, { where: {} })
    .then(() => {
      return;
    })
    .catch((err) => {
      throw err;
    });
};

// Set forum phase to VOEUX
exports.setWishPhase = async () => {
  Phase.update({ currentPhase: "VOEUX" }, { where: {} })
    .then(async () => {
      const candidatesAndCompanies = await User.findAll({
        where: {
          role: {
            [Sequelize.Op.or]: [User.ROLES.CANDIDATE, User.ROLES.COMPANY],
          },
        },
      });
      await Promise.all(
        candidatesAndCompanies.map(async (user) => {
          await MailService.sendWishPhase(user.email);
        })
      );
      return;
    })
    .catch((err) => {
      throw err;
    });
};

// Set forum phase to PLANNING
exports.setPlanningPhase = async () => {
  Phase.update({ currentPhase: "PLANNING" }, { where: {} })
    .then(async () => {
      const candidatesAndCompanies = await User.findAll({
        where: {
          role: {
            [Sequelize.Op.or]: [User.ROLES.CANDIDATE, User.ROLES.COMPANY],
          },
        },
      });
      await Promise.all(
        candidatesAndCompanies.map(async (user) => {
          await MailService.sendPlanningPhase(user.email);
        })
      );
      return;
    })
    .catch((err) => {
      throw err;
    });
};

exports.getCurrentPhase = async () => {
  try {
    return await Phase.findOne({ where: {}, attributes: ["currentPhase"] });
  } catch (err) {
    throw err;
  }
};
