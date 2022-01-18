const db = require("../models");
const Planning = db.planning;
const Slot = db.slot;
const CandidateProfile = db.candidate_profiles;
const User = db.users;

const PlanningService = require("../services/planning.service");

exports.generationPlanning = async (req, res) => {
    PlanningService.createPlanning();
    return res.send("ok");
}

exports.findByCandidateId = async (req, res) => {
  try {
    const candidateProfileId = req.params.candidateId;

    //On recherche le userId à partir de l'id du candidat
    const candidate_profile = await CandidateProfile.findOne({
      where: { id: candidateProfileId },
      include: [
        { model: User }
      ],
    });

    if (!candidate_profile) {
      return res.status(404).send("Impossible de retrouver ce candidat");
    }

    const userId = candidate_profile.user.id;

    //On recherche les différents rdv prévus pour ce candidat
    const slots = await Slot.findAll(
      { where: { userPlanning: userId } }
    );

    if (!slots) {
      return res.status(404).send("Il n'existe pas de planning pour cet user");
    }

    return res.send(slots);

  } catch (err) {
    throw err;
  }
    
}

exports.findByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {

    //On recherche les slots de ce planning
    const slots = await Slot.findAll(
      { where: { userPlanning: userId } }
    );

    if (!slots) {
      return res.status(404).send("Il n'existe pas de planning pour cet user");
    }

    return res.send(slots);
  } catch (err) {
    throw err;
  }
}