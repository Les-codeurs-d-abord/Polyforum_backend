const PhaseService = require("../services/phase.service");
const PlanningService = require("../services/planning.service");

// Set forum phase to INSCRIPTION
exports.setInscriptionPhase = async (req, res) => {
  PhaseService.setInscriptionPhase()
    .then(() => {
      return res.send("Polyforum en phase d'inscription");
    })
    .catch((err) => {
      return res.status(500).send(err.message);
    });
};

// Set forum phase to INSCRIPTION
exports.setWishPhase = async (req, res) => {
  PhaseService.setWishPhase()
    .then(() => {
      return res.send("Polyforum en phase de voeux");
    })
    .catch((err) => {
      return res.status(500).send(err.message);
    });
};

// Set forum phase to INSCRIPTION
exports.setPlanningPhase = async (req, res) => {
  PlanningService.createPlanning()
    .then(() => {
      PhaseService.setPlanningPhase()
        .then(() => {
          return res.send("Polyforum en phase de planning");
        })
        .catch((err) => {
          return res.status(500).send(err.message);
        });
    })
    .catch((err) => {
      return res.status(500).send(err.message);
    });
};

exports.getCurrentPhase = async (req, res) => {
  try {
    const currentPhase = await PhaseService.getCurrentPhase();
    return res.send(currentPhase);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
