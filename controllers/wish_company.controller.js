const db = require("../models");
const Wish_Company = db.wish_company;
const Wish_CompanyService = require("../services/wish_company.service");


exports.createWishCompany = async (req, res) => {
    const { rank, companyId, candidateId } = req.body;
    console.log(rank);
    console.log(companyId);
    console.log(candidateId);

    if (!(companyId && candidateId && rank)) {
        return res.status(400).send("All input is required");
    }

    const wishCompany = {
        companyId: companyId,
        candidateId: candidateId,
        rank: rank
    };


    Wish_Company.create(wishCompany)
    .then((value) => res.status(201).json({ value }))
    .catch(error => res.status(400).json({ error })
    );
};


exports.update = async (req, res) => {
    const wishId = req.params.wishId;
    const rank = req.body.rank;
  
    if (!rank) {
      return res.status(400).send("Le nouveau classement est vide, impossible de le traiter");
    }

    try {
      newRank = await Wish_CompanyService.update(wishId, rank);
      return res.send(`Voeux ${wishId} mis à jour avec le nouveau rang ${newRank}`);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  exports.findAllByCompanyId = async (req, res) => {
    const companyId = req.params.companyId;
    
    if (!(companyId)) {
      return res.status(400).send("All input is required");
    }

    try {
      const wishesFromCompany = await Wish_CompanyService.findAllByCompanyId(companyId);
      return res.send(wishesFromCompany);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };


  exports.deleteById = async (req, res) => {
    const wishId = req.params.wishId;

    try {
        const wishDeleted = await Wish_Company.destroy({
          where: { id: wishId },
        });
    
        if (wishDeleted) {
          // Wish deleted
          return res.status(200).send("Voeux supprimé");
        } else {
          // Wish not found
          return res.status(404).send(`Pas de voeux trouvé avec l'id ${wishId}`);
        }
      } catch (err) {
        return res.status(500).send(err.message);
      }

  };
