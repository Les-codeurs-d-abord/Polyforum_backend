const db = require("../models");
const Slot = db.slot;
const CandidateProfile = db.candidate_profiles;
const CompanyProfile = db.company_profiles;
const User = db.users;

const PlanningService = require("../services/planning.service");
const CandidateService = require("../services/candidate_profile.service");
const CompanyService = require("../services/company_profile.service");

const { Sequelize } = require("../models");

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

exports.findFreeCandidatesAtGivenPeriod = async (req, res) => {
  const period = req.params.period;

  if (!(period)) {
    return res.status(400).send("Period is required");
  }

  try {

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

    const freeCandidates = await CandidateProfile.findAll({
      where: { userId: listId
      },
      attributes: ['userId', 'firstName', 'lastName']
    }
    );

    return res.send(freeCandidates);
  } catch (err) {
    throw err;
  }
}

exports.addMeeting = async (req, res) => {

  const obj = JSON.parse(req.body.data);
  const {
    userIdCandidate,
    userIdCompany,
    period
  } = obj;

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
  const candidate = await CandidateService.findById(userIdCandidate);
  const company = await CompanyService.findById(userIdCompany);
  
  if (!candidate) {
    return res.status(409).send("Le candidat n'existe pas");
  }
  if (!company) {
    return res.status(409).send("L'entreprise n'existe pas");
  }

  try {

    //slot entreprise\\

    //Check if is there is a free slot
    const olderSlotA = await Slot.findOne({
      where: {
        period: period,
        userPlanning: userIdCompany
      }
    });

    if (!olderSlotA) {
      return res.status(409).send("Le planning n'était pas généré par l'entreprise");
    }

    const slotValuesA = {
      userMet: userIdCandidate,
      companyName: company.companyName,
      candidateName: candidate.firstName + candidate.lastName,
      logo: company.logo
  };
  // const slotA = await Slot.create(slotValuesA);

  const slotA = await Slot.update(slotValuesA, {
    where: { userPlanning: userIdCompany, period:period },
  });

  if (!slotA) {
    return res.status(409).send("Impossible de créer la rencontre");
  }

  //slot candidate
      //Check if is there is a free slot
      const olderSlotB = await Slot.findOne({
        where: {
          period: period,
          userPlanning: userIdCandidate
        }
      });
  
      if (!olderSlotB) {
        return res.status(409).send("Le planning n'était pas généré par le candidat");
      }
    const slotValuesB = {
      userMet: userIdCompany,
      companyName: company.companyName,
      candidateName: candidate.firstName + candidate.lastName,
      logo: company.logo
    };
    // const slotB = await Slot.create(slotValuesB);

    const slotB = await Slot.update(slotValuesB, {
      where: { userPlanning: userIdCandidate, period:period },
    });

    if (!slotB) {
      return res.status(409).send("Impossible de créer la rencontre");
    }

    return res.status(201).send("Rencontre créée avec succès");
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

exports.deleteSlot = async (req, res) => {
  const obj = JSON.parse(req.body.data);
  const {
    userIdCandidate,
    userIdCompany,
    period
  } = obj;

  if (!userIdCandidate || !userIdCompany || !period) {
    return res.status(400).send("Au moins un champ manquant (id/period)");
  }

  //Check if slots exist
  const slotToDelete = await Slot.findAll({
    where: { 
      [Sequelize.Op.or]: [
        { userPlanning: userIdCandidate, userMet: userIdCompany, period: period },
        { userPlanning: userIdCompany, userMet: userIdCandidate, period: period }
      ]
     },
  });

  if (!slotToDelete || !(slotToDelete.length == 2)) {
    return res.status(409).send("Ce créneau n'existe pas");
  }

  const newSlotValues = {
    userMet: null,
    companyName: null,
    candidateName: null,
    logo: null
  };

  const result = await Slot.update(newSlotValues, {
    where: { 
      [Sequelize.Op.or]: [
        { userPlanning: userIdCandidate, userMet: userIdCompany, period: period },
        { userPlanning: userIdCompany, userMet: userIdCandidate, period: period }
      ]
     },
  });

  return res.status(201).send("Rencontre supprimée avec succès");
}