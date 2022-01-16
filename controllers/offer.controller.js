const db = require("../models");
const Offers = db.offers;
const Tags = db.tags;
const Offer_Tags = db.offer_tags;
const Offer_Links = db.offer_links;
const Company_Profiles = db.company_profiles;
const { Sequelize } = require("../models");

// Create an offer
exports.createOffer = async (req, res) => {
  const { companyProfileId, name, description, offerLink, phoneNumber, email, address } = req.body;

  // Validate input
  if (!(name && description && companyProfileId && offerLink && email && phoneNumber && address)) {
    return res.status(400).send("All input is required");
  }


  const offer = {
    companyProfileId: companyProfileId,
    name: name,
    description: description,
    email: email,
    phoneNumber: phoneNumber,
    address: address,
    offerLink: offerLink
  };

  Offers.create(offer)
    .then(
      (value) => res.status(201).json({ value }))
    .catch(error => res.status(400).json({ error })
    );
};

exports.getAllOffer = async (req, res) => {
  try {
    var whereStatmentTag = {};
    var whereStatmentInput = {};

    if (req.query.tag) {
      //Check if Tag already exists
      const checkOfferTag = await Offer_Tags.findOne({
        where: {
          id: req.query.tag
        },
      });

      if (checkOfferTag) {
        const offerIdList = await Offers.findAll({
          raw: true,
          where: { '$offer_tags.tagId$': req.query.tag },
          attributes: ['id'],
          include: [
            {
              model: Offer_Tags,
              attributes: [],
              include: [
                {
                  attributes: [],
                  model: Tags,
                }
              ],
            }
          ],
        });

        var idList = [];
        for (var i in offerIdList) {
          idList.push(offerIdList[i]['id']);
        }

        whereStatmentTag.id = idList;
      }
    }

    if (req.query.input) {
      whereStatmentInput = Sequelize.or(
        {
          "name": {
            [Sequelize.Op.like]: "%" + req.query.input + "%"
          },
        },
        {
          "description": {
            [Sequelize.Op.like]: "%" + req.query.input + "%"
          },
        },
        {
          '$company_profile.companyName$': {
            [Sequelize.Op.like]: "%" + req.query.input + "%"
          },
        }
      );
    }

    Offers.findAll({
      where: Sequelize.and(
        whereStatmentTag,
        whereStatmentInput,
      ),
      include: [
        {
          model: Company_Profiles,
        },
        {
          model: Offer_Links,
        },
        {
          model: Offer_Tags,
          include: [
            {
              model: Tags,
            }
          ],
        }
      ],
    }).then(offerList => {
      console.log(offerList);
      return res.status(200).json(offerList);
    });
  }
  catch (err) {
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
    .catch(error => res.status(400).json({ error })
    );
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
    .catch(error => res.status(400).json({ error })
    );
};

//Find one by Id
exports.findOfferTagByOfferId = async (req, res) => {
  const offerId = req.params.offerId;

  try {
    const offer_tag = await Offer_Tags.findAll({
      where: {
        offerId: offerId,
      }
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

//Find All
exports.findAllOfferTags = async (req, res) => {
  try {
    const offer_tags = await Offer_Tags.findAll({
      group: ['tagId'],
      include: [
        {
          model: Tags,
        }
      ]
    });
    return res.send(offer_tags);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};