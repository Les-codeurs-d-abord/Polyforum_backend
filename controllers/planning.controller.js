const db = require("../models");
const Wish_Company = db.wish_company;
const Wish_Candidate = db.wish_candidate;
const Offers = db.offers;


const PlanningService = require("../services/planning.service");
const CompanyService = require("../services/company_profile.service");


//const UserService = require("../services/user.service");

exports.generationPlanning = async (req, res) => {

    // CompanyService.createCompanyProfile(6, 'Clyde & Co');
    // CompanyService.createCompanyProfile(7, 'Polycopie');
    // CompanyService.createCompanyProfile(8, "L'entreprise");

    // const offer = {
    //     companyId: 6,
    //     name: 'Alternance java',
    //     description: 'blablabla',
    //     email: 'company1@gmail.com',
    //     phoneNumber: '01.70.67.23.12',
    //     address: '71, Rue de la Pompe 78200 MANTES-LA-JOLIE',
    //   };
    
      // Offers.create(offer)

    PlanningService.createPlanning();
    return res.send("ok");
}