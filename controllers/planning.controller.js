const db = require("../models");
const Slot = db.slot;
const CandidateProfile = db.candidate_profiles;
const CompanyProfile = db.company_profiles;
const User = db.users;

const PlanningService = require("../services/planning.service");

exports.generationPlanning = async (req, res) => {
    PlanningService.createPlanning();
    return res.send("Planning généré");
}

exports.findByCandidateId = async (req, res) => {
  try {
    const candidateProfileId = req.params.candidateProfileId;

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

exports.findByCompanyId = async (req, res) => {
  
  try {
    const companyProfileId = req.params.companyProfileId;

    //On recherche le userId à partir de l'id du candidat
    const company_profile = await CompanyProfile.findOne({
      where: { id: companyProfileId },
      include: [
        { model: User }
      ],
    });

    if (!company_profile) {
      return res.status(404).send("Impossible de retrouver ce candidat");
    }

    const userId = company_profile.user.id;

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