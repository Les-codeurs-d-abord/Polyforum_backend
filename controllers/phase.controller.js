const PhaseService = require("../services/phase.service");

// Set forum phase to INSCRIPTION
exports.setInscriptionPhase = async (req, res) => {
  PhaseService.setInscriptionPhase()
    .then(() => {
      res.send("Polyforum en phase d'inscription");
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

// Set forum phase to INSCRIPTION
exports.setWishPhase = async (req, res) => {
  PhaseService.setWishPhase()
    .then(() => {
      res.send("Polyforum en phase de voeux");
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

// Set forum phase to INSCRIPTION
exports.setPlanningPhase = async (req, res) => {
  PlanningService.createPlanning()
    .then(() => {
      PhaseService.setPlanningPhase()
        .then(() => {
          res.send("Polyforum en phase de planning");
        })
        .catch((err) => {
          res.status(500).send(err.message);
        });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

exports.getCurrentPhase = async (req, res) => {
  try {
    const currentPhase = await PhaseService.getCurrentPhase();
    res.send(currentPhase);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
