const db = require("../models");
const Wish_Company = db.wish_company;
const Wish_Candidate = db.wish_candidate;
const Companies = db.company_profiles;
const Candidates = db.candidate_profiles;
const Offer = db.offers;
const Planning = db.planning;
const Slot = db.slot;


exports.createPlanning = async () => {
    //Récupération des voeux et informations enregistées en base de données
    const wishesCompanies = await Wish_Company.findAll({
        order: [
            ['rank', 'ASC'],
        ],
        attributes: ['id', 'companyProfileId', 'candidateProfileId', 'rank'],
    });
    const wishesCandidates = await Wish_Candidate.findAll({
        order: [
            ['rank', 'ASC'],
        ],
        attributes: ['id', 'candidateProfileId', 'offerId', 'rank'],
    });
    const allCompanies = await Companies.findAll();
    const allCandidates = await Candidates.findAll();
    
    let mapCompanyIndex = new Map();
    let mapCandidateIndex = new Map();
    let mapCandidateUserIdToCandidateId = new Map();
    let mapCompanyUserIdToCompanyId = new Map();

    let mapOffersCompany = new Map();

    const nbSlotPerUser = 8;
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
    let mapOfferCompany = new Map();
    for (var w = 0; w < wishesCandidates.length; w++) {
        const offer = await Offer.findByPk(wishesCandidates[w].offerId);
        mapOffersCompany.set(offer.id, offer.dataValues.companyProfileId)
        const indexCandidate = mapCandidateIndex.get(wishesCandidates[w].candidateProfileId);
        const indexCompany = mapCompanyIndex.get(offer.dataValues.companyProfileId);
        mapOfferCompany.set(wishesCandidates[w].offerId, offer.dataValues.companyProfileId);
        if (matrixWishes[indexCompany][indexCandidate]%2 == 0) {
            matrixWishes[indexCompany][indexCandidate] += costWishCandidate;
        }
    }

    console.log(matrixWishes);

    //On cherche les voeux communs aux deux parties
    for (var w = 0; w < allCompanies.length; w++) {
        for (var w2 = 0; w2 < allCandidates.length; w2++) {
                if (matrixWishes[w][w2] == 3){
                    const company = allCompanies[w];
                    const candidate = allCandidates[w2];
                    const indexNewSlot = checkFirstIndexOfAvailability(planningCompany[w], planningCandidate[w2], nbSlotPerUser);
                    if (indexNewSlot >= 0) {
                        planningCompany[w][indexNewSlot] = candidate.userId;
                        planningCandidate[w2][indexNewSlot] = company.userId;
                    }
                }
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
    for (var w = 0; w < allCompanies.length; w++) {

        // Création des slots associés
        for (var s = 0; s < nbSlotPerUser; s++) {
            const company = allCompanies[w];
            if (planningCompany[w][s]) {
                const idCandidate = mapCandidateUserIdToCandidateId.get(planningCompany[w][s]);
                const candidate = allCandidates[mapCandidateIndex.get(idCandidate)];
                const nameCandidate = candidate.firstName +" " + candidate.lastName;

                const slotValues = {
                    userPlanning: company.userId,
                    userMet: candidate.userId,
                    period: convertIndexAsPeriod(s),
                    companyName: company.companyName,
                    candidateName: nameCandidate,
                    logo: company.logo
                };
                const slot = await Slot.create(slotValues);
            }
            else {
                const slotValues = {
                    userPlanning: company.userId,
                    period: convertIndexAsPeriod(s)
                };
                const slot = await Slot.create(slotValues);               
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
                const nameCandidate = candidate.firstName +" " + candidate.lastName;

                const slotValues = {
                    userPlanning: candidate.userId,
                    userMet: company.userId,
                    period: convertIndexAsPeriod(s),
                    companyName: company.companyName,
                    candidateName: nameCandidate,
                    logo: company.logo
                };
                const slot = await Slot.create(slotValues);
            }
            else {
                const slotValues = {
                    userPlanning: candidate.userId,
                    period: convertIndexAsPeriod(s)
                };
                const slot = await Slot.create(slotValues);               
            }
        }
    }


}



function checkFirstIndexOfAvailability(planningCompany, planningCandidate,nbSlotPerUser) {
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