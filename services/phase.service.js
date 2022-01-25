const db = require("../models");
const Phase = db.phase;

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
  const existingPhase = await Phase.findOne({ where: {} });
  if (!existingPhase) {
    Phase.create({ currentPhase: "VOEUX" })
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  }
  Phase.update({ currentPhase: "VOEUX" }, { where: {} })
    .then(() => {
      return;
    })
    .catch((err) => {
      throw err;
    });
};

// Set forum phase to PLANNING
exports.setPlanningPhase = async () => {
  const existingPhase = await Phase.findOne({ where: {} });
  if (!existingPhase) {
    Phase.create({ currentPhase: "PLANNING" })
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  }
  Phase.update({ currentPhase: "PLANNING" }, { where: {} })
    .then(() => {
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
