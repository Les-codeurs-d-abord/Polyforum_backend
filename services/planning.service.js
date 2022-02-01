const db = require("../models");
const Wish_Company = db.wish_company;
const Wish_Candidate = db.wish_candidate;
const Companies = db.company_profiles;
const Candidates = db.candidate_profiles;
const Offer = db.offers;
const Planning = db.planning;
const Slot = db.slot;
const { Sequelize } = require("../models");


exports.createPlanning = async () => {
    console.log("Début création du planning");
    //Récupération des voeux et informations enregistées en base de données
    const wishesCompanies = await Wish_Company.findAll({
        order: [
            ['rank', 'ASC'],
            Sequelize.literal('rand()')
        ],
        attributes: ['id', 'companyProfileId', 'candidateProfileId', 'rank'],
    });

    const wishesCandidates = await Wish_Candidate.findAll({
        order: [
            ['rank', 'ASC'],
            Sequelize.literal('rand()')
        ],
        attributes: ['id', 'candidateProfileId', 'offerId', 'rank'],
    });

    const allCompanies = await Companies.findAll();
    const allCandidates = await Candidates.findAll();

    let mapOffersCompany = new Map();
    const listOffers = await Offer.findAll({ raw: true });
    for (var i = 0; i < listOffers.length; i++) {
        const offer = listOffers[i];
        mapOffersCompany.set(offer.id, offer.companyProfileId)
    }

    let mapCompanyIndex = new Map();
    let mapCandidateIndex = new Map();
    let mapCandidateUserIdToCandidateId = new Map();
    let mapCompanyUserIdToCompanyId = new Map();

    const nbSlotPerUser = 8;
    const minNbMeeting = 2;
    let planningCandidate = new Array(allCandidates.length);
    let planningCompany = new Array(allCompanies.length);

    for (var s = 0; s < allCandidates.length; s++) {
        planningCandidate[s] = new Array(nbSlotPerUser);
        mapCandidateUserIdToCandidateId.set(allCandidates[s].userId, allCandidates[s].id);
    }
    for (var s = 0; s < allCompanies.length; s++) {
        planningCompany[s] = new Array(nbSlotPerUser);
        mapCompanyUserIdToCompanyId.set(allCompanies[s].userId, allCompanies[s].id);
    }

    //matrice des voeux
    let matrixWishes = new Array(allCompanies.length);
    for (var w = 0; w < allCompanies.length; w++) {
        matrixWishes[w] = new Array(allCandidates.length);
        mapCompanyIndex.set(allCompanies[w].id, w);
        for (var w2 = 0; w2 < allCandidates.length; w2++) {
            matrixWishes[w][w2] = 0;
            mapCandidateIndex.set(allCandidates[w2].id, w2);
        }
    }

    //On remplit la matrice avec les voeux qu'ont fait les entreprises
    const costWishCompany = 2;
    for (var w = 0; w < wishesCompanies.length; w++) {
        const indexCompany = mapCompanyIndex.get(wishesCompanies[w].companyProfileId);
        const indexCandidate = mapCandidateIndex.get(wishesCompanies[w].candidateProfileId);
        if (matrixWishes[indexCompany][indexCandidate] == 0) {
            matrixWishes[indexCompany][indexCandidate] += costWishCompany;
        }
    }

    //On remplit la matrice avec les voeux qu'ont fait les candidats
    const costWishCandidate = 1;
    for (var w = 0; w < wishesCandidates.length; w++) {
        const indexCandidate = mapCandidateIndex.get(wishesCandidates[w].candidateProfileId);
        const indexCompany = mapCompanyIndex.get(mapOffersCompany.get(wishesCandidates[w].offerId));
        if (matrixWishes[indexCompany][indexCandidate] % 2 == 0) {
            matrixWishes[indexCompany][indexCandidate] += costWishCandidate;
        }
    }

    //On cherche les voeux communs aux deux parties
    let listWishesToAdd = new Array();
    for (var w = 0; w < allCompanies.length; w++) {
        for (var w2 = 0; w2 < allCandidates.length; w2++) {
            if (matrixWishes[w][w2] == 3) {
                listWishesToAdd[listWishesToAdd.length] = (w * allCandidates.length + w2);
            }
        }
    }

    //On  mélange ces wish
    listWishesToAdd = listWishesToAdd.sort(() => (Math.random() > .5) ? 1 : -1);

    for (var w = 0; w < listWishesToAdd.length; w++) {
        const indexCandidate = listWishesToAdd[w] % allCandidates.length;
        const indexCompany = Math.floor(listWishesToAdd[w] / allCandidates.length);

        const company = allCompanies[indexCompany];
        const candidate = allCandidates[indexCandidate];
        const indexNewSlot = checkFirstIndexOfAvailability(planningCompany[indexCompany], planningCandidate[indexCandidate], nbSlotPerUser);
        if (indexNewSlot >= 0) {
            planningCompany[indexCompany][indexNewSlot] = candidate.userId;
            planningCandidate[indexCandidate][indexNewSlot] = company.userId;
        }
    }

    //On cherche les voeux des entreprises
    for (var w = 0; w < wishesCompanies.length; w++) {
        const indexCandidate = mapCandidateIndex.get(wishesCompanies[w].candidateProfileId);
        const indexCompany = mapCompanyIndex.get(wishesCompanies[w].companyProfileId);

        if (matrixWishes[indexCompany][indexCandidate] == 2) {
            const indexNewSlot = checkFirstIndexOfAvailability(planningCompany[indexCompany], planningCandidate[indexCandidate], nbSlotPerUser);
            if (indexNewSlot >= 0) {
                planningCompany[indexCompany][indexNewSlot] = allCandidates[indexCandidate].userId;
                planningCandidate[indexCandidate][indexNewSlot] = allCompanies[indexCompany].userId;
            }
        }

    }

    //On cherche les voeux des candidats
    for (var w = 0; w < wishesCandidates.length; w++) {
        const indexCandidate = mapCandidateIndex.get(wishesCandidates[w].candidateProfileId);
        const indexCompany = mapCompanyIndex.get(mapOffersCompany.get(wishesCandidates[w].offerId));

        if (matrixWishes[indexCompany][indexCandidate] == 1) {
            const indexNewSlot = checkFirstIndexOfAvailability(planningCompany[indexCompany], planningCandidate[indexCandidate], nbSlotPerUser);
            if (indexNewSlot >= 0) {
                planningCompany[indexCompany][indexNewSlot] = allCandidates[indexCandidate].userId;
                planningCandidate[indexCandidate][indexNewSlot] = allCompanies[indexCompany].userId;
            }
        }

    }

    let listDESCCompanies = new Array();
    for (var w = 0; w < allCompanies.length; w++) {
        const nbFilledSlot = getNumberFilledSlots(planningCompany[w], nbSlotPerUser);
        company = new companyWithNbSlot(w, nbSlotPerUser - nbFilledSlot);
        listDESCCompanies[listDESCCompanies.length] = company;
    }

    listDESCCompanies.sort((a, b) => (a.nbFreeSlots > b.nbFreeSlots) ? -1 : (a.nbFreeSlots === b.nbFreeSlots) ? ((a.nbFreeSlots > b.nbFreeSlots) ? -1 : 1) : 1)

    let listDESCCandidates = new Array();
    let listNEMCandidates = new Array();
    for (var w = 0; w < allCandidates.length; w++) {
        const nbFilledSlot = getNumberFilledSlots(planningCandidate[w], nbSlotPerUser);
        c = new candidateWithNbSlot(w, nbSlotPerUser - nbFilledSlot);
        if (nbFilledSlot < minNbMeeting) {
            const diff = minNbMeeting - nbFilledSlot;
            for (var i = 0; i < diff; i++) {
                listNEMCandidates[listNEMCandidates.length] = c;
            }
        }
        listDESCCandidates[listDESCCandidates.length] = c
    }
    listDESCCandidates.sort((a, b) => (a.nbFreeSlots > b.nbFreeSlots) ? -1 : (a.nbFreeSlots === b.nbFreeSlots) ? ((a.nbFreeSlots > b.nbFreeSlots) ? -1 : 1) : 1)


    listNEMCandidates = listNEMCandidates.sort(() => (Math.random() > .5) ? 1 : -1);

    //on fill les candidats
    for (var w = 0; w < listNEMCandidates.length; w++) {
        for (var e = 0; e < listDESCCompanies.length; e++) {
            const indexCandidate = listNEMCandidates[w].indexCandidate;
            const indexCompany = listDESCCompanies[e].indexCompany;
            if (matrixWishes[indexCompany][indexCandidate] == 0) {
                const indexNewSlot = checkFirstIndexOfAvailability(planningCandidate[indexCandidate], planningCompany[indexCompany], nbSlotPerUser);
                if (indexNewSlot >= 0) {
                    planningCompany[indexCompany][indexNewSlot] = allCandidates[indexCandidate].userId;
                    planningCandidate[indexCandidate][indexNewSlot] = allCompanies[indexCompany].userId;
                    listNEMCandidates[w].addMeeting();
                    listDESCCompanies[e].addMeeting();
                    listDESCCompanies.sort((a, b) => (a.nbFreeSlots > b.nbFreeSlots) ? -1 : (a.nbFreeSlots === b.nbFreeSlots) ? ((a.nbFreeSlots > b.nbFreeSlots) ? -1 : 1) : 1)
                    matrixWishes[indexCompany][indexCandidate] = -1;

                    break;
                }
            }
        }
    }

    //Fill companies
    let listNEMCompanies = new Array();
    for (var w = 0; w < allCompanies.length; w++) {
        const nbFilledSlot = getNumberFilledSlots(planningCompany[w], nbSlotPerUser);
        company = new companyWithNbSlot(w, nbSlotPerUser - nbFilledSlot);
        if (nbFilledSlot < minNbMeeting) {
            const diff = minNbMeeting - nbFilledSlot;
            for (var i = 0; i < diff; i++) {
                listNEMCompanies[listNEMCompanies.length] = company;
                // listNEMCompanies.push(company);
            }
        }
    }


    //Shuffle list of companies with not enough meetings
    listNEMCompanies = listNEMCompanies.sort(() => (Math.random() > .5) ? 1 : -1);

    for (var w = 0; w < listNEMCompanies.length; w++) {
        for (var e = 0; e < listDESCCandidates.length; e++) {
            const indexCompany = listNEMCompanies[w].indexCompany;
            const indexCandidate = listDESCCandidates[e].indexCandidate;
            if (matrixWishes[indexCompany][indexCandidate] == 0) {
                const indexNewSlot = checkFirstIndexOfAvailability(planningCandidate[indexCandidate], planningCompany[indexCompany], nbSlotPerUser);

                if (indexNewSlot >= 0) {
                    planningCompany[indexCompany][indexNewSlot] = allCandidates[indexCandidate].userId;
                    planningCandidate[indexCandidate][indexNewSlot] = allCompanies[indexCompany].userId;
                    listNEMCompanies[w].addMeeting();
                    listDESCCandidates[e].addMeeting();
                    listDESCCompanies.sort((a, b) => (a.nbFreeSlots > b.nbFreeSlots) ? -1 : (a.nbFreeSlots === b.nbFreeSlots) ? ((a.nbFreeSlots > b.nbFreeSlots) ? -1 : 1) : 1)
                    matrixWishes[indexCompany][indexCandidate] = -1;
                    break;
                }
            }
        }
    }

    // ----- Enregistrement des données en base ----- \\
    // On efface les vielles valeurs de planning et de slot
    Planning.destroy({
        where: {},
        truncate: true
    });

    Slot.destroy({
        where: {},
        truncate: true
    });

    //Convertion matrice planning vers des slots de rdv...
    const listSlotToSave = new Array();
    for (var w = 0; w < allCompanies.length; w++) {

        // Création des slots associés
        for (var s = 0; s < nbSlotPerUser; s++) {
            const company = allCompanies[w];
            if (planningCompany[w][s]) {
                const idCandidate = mapCandidateUserIdToCandidateId.get(planningCompany[w][s]);
                const candidate = allCandidates[mapCandidateIndex.get(idCandidate)];
                const nameCandidate = candidate.firstName + " " + candidate.lastName;

                const slotValues = {
                    userPlanning: company.userId,
                    userMet: candidate.userId,
                    period: convertIndexAsPeriod(s),
                    companyName: company.companyName,
                    candidateName: nameCandidate,
                    logo: candidate.logo
                };
                listSlotToSave.push(slotValues);
            }
            else {
                const slotValues = {
                    userPlanning: company.userId,
                    period: convertIndexAsPeriod(s)
                };
                listSlotToSave.push(slotValues);

            }
        }
    }

    //Pareil pour les candidats
    for (var w = 0; w < allCandidates.length; w++) {

        // Création des slots associés
        for (var s = 0; s < nbSlotPerUser; s++) {
            const candidate = allCandidates[w];

            if (planningCandidate[w][s]) {
                const idCompany = mapCompanyUserIdToCompanyId.get(planningCandidate[w][s]);

                const company = allCompanies[mapCompanyIndex.get(idCompany)];
                const nameCandidate = candidate.firstName + " " + candidate.lastName;

                const slotValues = {
                    userPlanning: candidate.userId,
                    userMet: company.userId,
                    period: convertIndexAsPeriod(s),
                    companyName: company.companyName,
                    candidateName: nameCandidate,
                    logo: company.logo
                };
                listSlotToSave.push(slotValues);

            }
            else {
                const slotValues = {
                    userPlanning: candidate.userId,
                    period: convertIndexAsPeriod(s)
                };
                listSlotToSave.push(slotValues);

            }
        }
    }
    Slot.bulkCreate(
        listSlotToSave,
        {
            ignoreDuplicates: true,
        }
    )
}


function checkFirstIndexOfAvailability(planningCompany, planningCandidate, nbSlotPerUser) {
    for (var s = 0; s < nbSlotPerUser; s++) {
        if (!planningCandidate[s] && !planningCompany[s]) {
            return s;
        }
    }
    return -1;
}

function convertIndexAsPeriod(index) {
    switch (index) {
        case 0: return '14h - 14h30'
        case 1: return '14h30 - 15h'
        case 2: return '15h - 15h30'
        case 3: return '15h30 - 16h'
        case 4: return '16h - 16h30'
        case 5: return '16h30 - 17h'
        case 6: return '17h - 17h30'
        case 7: return '17h30 - 18h'
    }
}

function getNumberFilledSlots(planning, nbSlotPerUser) {
    let cpt = 0;
    for (var s = 0; s < nbSlotPerUser; s++) {
        if (planning[s]) {
            cpt++;
        }
    }
    return cpt;
}

class companyWithNbSlot {
    constructor(indexCompany, nbFreeSlots) {
        this.indexCompany = indexCompany;
        this.nbFreeSlots = nbFreeSlots;
    }

    addMeeting() {
        this.nbFreeSlots = this.nbFreeSlots - 1;
    }
}

class candidateWithNbSlot {
    constructor(indexCandidate, nbFreeSlots) {
        this.indexCandidate = indexCandidate;
        this.nbFreeSlots = nbFreeSlots;
    }

    addMeeting() {
        this.nbFreeSlots = this.nbFreeSlots - 1;
    }
}