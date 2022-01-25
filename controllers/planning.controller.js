const db = require("../models");
const Slot = db.slot;
const CandidateProfile = db.candidate_profiles;
const CompanyProfile = db.company_profiles;
const User = db.users;
const Op = require("sequelize");


const PlanningService = require("../services/planning.service");

exports.generationPlanning = async (req, res) => {
    PlanningService.createPlanning();
    return res.send("Planning généré");
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

exports.findByCompanyId = async (req, res) => {
  
  try {
    const companyProfileId = req.params.companyId;

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


exports.findFreeCompaniesAtGivenPeriod = async (req, res) => {
  console.log('dans la methode findFreeCompaniesAtGivenPeriod');

  const period = req.params.period;

  if (!(period)) {
    return res.status(400).send("Period is required");
  }

  try {

    //On recherche les slots de ce planning
    const idFree = await Slot.findAll(
      { 
        where: { period: period, userMet: null},
        attributes: ['userPlanning']
    }
    );

    if (!idFree) {
      return res.send();
    }

    const listId = [];
    for (var i = 0; i < idFree.length ; i ++) {
      listId[listId.length] = idFree[i]['dataValues']['userPlanning'];
    }
    console.log(listId)

    const freeCompanies = await CompanyProfile.findAll({
      where: { userId: listId
      },
      attributes: ['userId', 'companyName']
    }
    );

    return res.send(freeCompanies);
  } catch (err) {
    throw err;
  }
}