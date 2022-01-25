const db = require("../models");
const Slot = db.slot;
const CandidateProfile = db.candidate_profiles;
const CompanyProfile = db.company_profiles;
const User = db.users;
const Op = require("sequelize");


const PlanningService = require("../services/planning.service");
const CandidateService = require("../services/candidate_profile.service");
const CompanyService = require("../services/company_profile.service");

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

exports.addMeeting = async (req, res) => {
  const userIdCandidate = req.body.userIdCandidate;
  const userIdCompany = req.body.userIdCompany;
  const period = req.body.period;

  if (!userIdCandidate || !userIdCompany || !period)  {
    return res.status(400).send("Au moins un champ manquant (userId/period)");
  }

  //Check if meeting already exist
  const slot = await Slot.findOne(
    { where:
      { userPlanning: userIdCandidate, userMet: userIdCompany } 
    });
  if (slot) {
    return res.status(409).send("Une rencontre est déjà prévue pour ces deux utilisateurs");
  }

  //Check if candidate exist
  const userCandidate = await User.findByPk(userIdCandidate);
  if (!userCandidate) {
    return res.status(409).send("Le candidat n'existe pas");
  } else if (userCandidate['dataValues']['role'] != "CANDIDAT") {
    return res.status(409).send("L'utilisateur " + userIdCandidate +" n'est pas un candidat");
  }

  //Check if company exist
  const userCompany = await User.findByPk(userIdCompany);
  if (!userCompany) {
    return res.status(409).send("L'entreprise n'existe pas");
  } else if (userCompany['dataValues']['role'] != "ENTREPRISE") {
    return res.status(409).send("L'utilisateur " + userIdCompany +" n'est pas une entreprise");
  }

  //Retrieve company and candidate name
  const candidate = CandidateService.findById(userIdCandidate);
  const company = CompanyService.findById(userIdCompany);
  
  if (!candidate) {
    return res.status(409).send("Le candidat n'existe pas");
  }
  if (!company) {
    return res.status(409).send("L'entreprise n'existe pas");
  }

  try {
    //slot entreprise
    const slotValuesA = {
      userPlanning: userIdCompany,
      userMet: userIdCandidate,
      period: period,
      companyName: company.companyName,
      candidateName: candidate.firstName + candidate.lastName,
      logo: company.logo
  };
  const slotA = await Slot.create(slotValuesA);

  if (!slotA) {
    return res.status(409).send("Impossible de créer la rencontre");
  }

  //slot entreprise
    const slotValuesB = {
      userPlanning: userIdCandidate,
      userMet: userIdCompany,
      period: period,
      companyName: company.companyName,
      candidateName: candidate.firstName + candidate.lastName,
      logo: company.logo
    };
    const slotB = await Slot.create(slotValuesB);

    if (!slotB) {
      return res.status(409).send("Impossible de créer la rencontre");
    }

    return res.status(201).send("Rencontre créée avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }

}