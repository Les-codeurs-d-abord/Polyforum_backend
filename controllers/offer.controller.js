const db = require("../models");
const Offers = db.offers;
const Offer_Tags = db.offer_tags;
const Offer_Links = db.offer_links;
const Company_Profiles = db.company_profiles;
const WishCandidate = db.wish_candidate;
const { Sequelize } = require("../models");

const fs = require("fs");

// Create an offer
exports.createOffer = async (req, res) => {
  console.log(req.body.data);
  const obj = JSON.parse(req.body.data);
  const {
    companyProfileId,
    name,
    description,
    phoneNumber,
    email,
    address,
    links,
    tags,
  } = obj;

  // Validate input
  if (
    !(
      name &&
      description &&
      companyProfileId &&
      email &&
      phoneNumber &&
      address &&
      links &&
      tags
    )
  ) {
    return res.status(400).send("All input is required");
  }

  const checkCompanyProfile = await Company_Profiles.findByPk(companyProfileId);
  if (!checkCompanyProfile) {
    return res.status(409).send("Ce profil d'entreprise n'existe pas");
  }

  const offerData = {
    companyProfileId: companyProfileId,
    name: name,
    description: description,
    email: email,
    phoneNumber: phoneNumber,
    address: address,
  };

  try {
    const offer = await Offers.create(offerData);

    // Create new tags
    for (let i = 0; i < tags.length; i++) {
      await Offer_Tags.create({
        offerId: offer.id,
        label: tags[i],
      });
    }

    // Create new links
    for (let i = 0; i < links.length; i++) {
      await Offer_Links.create({
        offerId: offer.id,
        label: links[i],
      });
    }

    if (
      phoneNumber &&
      description &&
      checkCompanyProfile.status === "Incomplet"
    ) {
      Company_Profiles.update(
        { status: "Complet" },
        {
          where: { id: companyProfileId },
        }
      );
    }

    return res.send(offer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Update  an offer
exports.updateOffer = async (req, res) => {
  const obj = JSON.parse(req.body.data);
  const { name, description, phoneNumber, email, address, links, tags } = obj;

  const offerId = req.params.offerId;

  // Validate input
  if (!(name && description && phoneNumber && email && address)) {
    return res.status(400).send("All input is required");
  }

  const offerData = {
    name: name,
    phoneNumber: phoneNumber,
    description: description,
    address: address,
    email: email,
  };

  try {
    await Offers.update(offerData, {
      where: { id: offerId },
    });

    // Delete previous tags
    await Offer_Tags.destroy({
      where: { offerId: offerId },
    });

    // Create new tags
    for (let i = 0; i < tags.length; i++) {
      await Offer_Tags.create({
        offerId: offerId,
        label: tags[i],
      });
    }

    // Delete previous links
    await Offer_Links.destroy({
      where: { offerId: offerId },
    });

    // Create new links
    for (let i = 0; i < links.length; i++) {
      await Offer_Links.create({
        offerId: offerId,
        label: links[i],
      });
    }

    const updatedOffer = await Offers.findByPk(offerId, {
      include: [{ model: Offer_Tags }, { model: Offer_Links }],
    });
    return res.send(updatedOffer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.upload = async (req, res) => {
  const offerId = req.params.offerId;
  try {
    const filePath = req.files["offer"].path
      .replace("data\\", "")
      .replace("\\", "/");

    const checkOffer = await Offers.findOne({
      where: { id: offerId },
    });

    Offers.update(
      { offerFile: filePath },
      {
        where: { id: offerId },
      }
    );
    if (checkOffer.offerFile !== null) {
      fs.unlink("data/" + checkOffer.offerFile, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    // SUCCESS, offer file successfully uploaded
    return res.send(filePath);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

exports.getAllOffer = async (req, res) => {
  try {
    var whereStatmentTag = {};
    var whereStatmentInput = {};

    if (req.query.tag) {
      //Check if Tag already exists
      const checkOfferTag = await Offer_Tags.findOne({
        where: {
          label: req.query.tag,
        },
      });

      if (checkOfferTag) {
        const offerIdList = await Offers.findAll({
          raw: true,
          where: { "$offer_tags.label$": req.query.tag },
          attributes: ["id"],
          include: [
            {
              model: Offer_Tags,
            },
          ],
        });

        var idList = [];
        for (var i in offerIdList) {
          idList.push(offerIdList[i]["id"]);
        }

        whereStatmentTag.id = idList;
      }
    }

    if (req.query.input) {
      whereStatmentInput = Sequelize.or(
        {
          name: {
            [Sequelize.Op.like]: "%" + req.query.input + "%",
          },
        },
        {
          description: {
            [Sequelize.Op.like]: "%" + req.query.input + "%",
          },
        },
        {
          "$company_profile.companyName$": {
            [Sequelize.Op.like]: "%" + req.query.input + "%",
          },
        }
      );
    }

    Offers.findAll({
      where: Sequelize.and(whereStatmentTag, whereStatmentInput),
      include: [
        { model: Company_Profiles },
        { model: Offer_Links },
        { model: Offer_Tags },
      ],
    }).then((offerList) => {
      return res.status(200).json(offerList);
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.createOfferLink = async (req, res) => {
  const { offerId, label } = req.body;

  // Validate input
  if (!(label && offerId)) {
    return res.status(400).send("All input is required");
  }

  //Check if Tag already exists
  const checkOfferLink = await Offer_Links.findOne({
    where: {
      offerId: offerId,
      label: label,
    },
  });

  if (checkOfferLink) {
    return res.status(409).send("Tag Already Exist.");
  }

  const offerLink = {
    offerId: offerId,
    label: label,
  };

  Offer_Links.create(offerLink)
    .then((value) => res.status(201).json({ value }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOffer = async (req, res) => {
  const offerId = req.params.offerId;

  try {
    const wishes = await WishCandidate.findAll({
      where: { offerId: offerId },
    });

    await Promise.all(
      wishes.map(async (wish) => {
        await WishCandidate.decrement(
          { rank: 1 },
          {
            where: {
              rank: { [Sequelize.Op.gt]: wish.rank },
              candidateProfileId: wish.candidateProfileId,
            },
          }
        );
        await WishCandidate.destroy({
          where: { id: wish.id },
        });
      })
    );
    const checkOffer = await Offers.findByPk(offerId);

    const offerDeleted = await Offers.destroy({
      where: { id: offerId },
    });
    if (offerDeleted) {
      // Offer deleted
      const offersRemaining = await Offers.findOne({
        where: { companyProfileId: checkOffer.companyProfileId },
      });
      if (!offersRemaining) {
        await Company_Profiles.update(
          { status: "Incomplet" },
          { where: { id: checkOffer.companyProfileId, status: "Complet" } }
        );
      }
      return res.status(200).send("Offre supprimée");
    } else {
      // Offer not found
      return res.status(404).send("Pas d'offre trouvée");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

//Offer Tags//
//Create
exports.createOfferTag = async (req, res) => {
  const { offerId, tagId } = req.body;

  // Validate input
  if (!(offerId && tagId)) {
    return res.status(400).send("All input are required");
  }

  //Check if Tag and Offer exist
  const checkTag = await Tags.findOne({
    where: {
      id: tagId,
    },
  });
  const checkOffer = await Offers.findOne({
    where: {
      id: offerId,
    },
  });
  if (!(checkTag && checkOffer)) {
    return res.status(409).send("Tag of Offer doesn't Exist.");
  }

  //Check if offer tag already exists
  const checkOfferTag = await Offer_Tags.findOne({
    where: {
      tagId: tagId,
      offerId: offerId,
    },
  });
  if (checkOfferTag) {
    return res.status(400).send("Bad request: Offer Tag already exists.");
  }

  const offer_tag = {
    offerId: offerId,
    tagId: tagId,
  };

  Offer_Tags.create(offer_tag)
    .then((value) => res.status(201).json({ value }))
    .catch((error) => res.status(400).json({ error }));
};

//Find one by Id
exports.findOfferTagByOfferId = async (req, res) => {
  const offerId = req.params.offerId;

  try {
    const offer_tag = await Offer_Tags.findAll({
      where: {
        offerId: offerId,
      },
    });

    if (offer_tag) {
      return res.send(offer_tag);
    } else {
      return res.status(404).send(`Offer Tag unfound with offerId: ${offerId}`);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
