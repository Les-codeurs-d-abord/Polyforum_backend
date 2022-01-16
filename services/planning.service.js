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
        attributes: ['id', 'companyId', 'candidateId', 'rank'],
    });
    const wishesCandidates = await Wish_Candidate.findAll({
        order: [
            ['rank', 'ASC'],
        ],
        attributes: ['id', 'candidateId', 'offerId', 'rank'],
    });
    const allCompanies = await Companies.findAll();
    const allCandidates = await Candidates.findAll();
    
    let mapCompanyIndex = new Map();
    let mapCandidateIndex = new Map();

    const nbSlotPerUser = 8;
    let planningCandidate = new Array(allCandidates.length);
    let planningCompany = new Array(allCompanies.length);

    for (var s = 0; s < allCandidates.length; s++) {
        planningCandidate[s] = new Array(nbSlotPerUser);
    }
    for (var s = 0; s < allCompanies.length; s++) {
        planningCompany[s] = new Array(nbSlotPerUser);
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
        const indexCompany = mapCompanyIndex.get(wishesCompanies[w].companyId);
        const indexCandidate = mapCandidateIndex.get(wishesCompanies[w].candidateId);
        matrixWishes[indexCompany][indexCandidate] += costWishCompany;
    }

    //On remplit la matrice avec les voeux qu'ont fait les candidats
    const costWishCandidate = 1;
    let mapOfferCompany = new Map();
    for (var w = 0; w < wishesCandidates.length; w++) {
        const offer = await Offer.findByPk(wishesCandidates[w].offerId);
        const indexCandidate = mapCandidateIndex.get(wishesCandidates[w].candidateId);
        const indexCompany = mapCompanyIndex.get(offer.dataValues.companyProfileId);
        mapOfferCompany.set(wishesCandidates[w].offerId, offer.dataValues.companyProfileId)
        matrixWishes[indexCompany][indexCandidate] += costWishCandidate;
    }

    //On cherche les voeux communs aux deux parties
    for (var w = 0; w < allCompanies.length; w++) {
        for (var w2 = 0; w2 < allCandidates.length; w2++) {
                if (matrixWishes[w][w2] == 3){
                    const company = allCompanies[w];
                    const candidate = allCandidates[w2];
                    const indexNewSlot = checkFirstIndexOfAvailability(planningCompany[w], planningCandidate[w2], nbSlotPerUser);
                    if (indexNewSlot >= 0) {
                        planningCompany[w] = allCandidates[w2].id;
                        planningCandidate[w2] = allCompanies[w].id;
                    }
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

        //Construction du planning...
        const planningValues = {
            userPlanning: allCompanies[w].userId
        };
        const planning = await Planning.create(planningValues);

        // Création des slots associés
        for (var s = 0; s < nbSlotPerUser; s++) {

            if (planningCompany[w][s]) {
                console.log('il y a un rdv')
            } else {
                console.log('pas de rendez vous')
            }
            //const slot = await Slot.createSlot();
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