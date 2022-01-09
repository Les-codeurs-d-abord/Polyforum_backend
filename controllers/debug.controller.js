const db = require("../models");
const Offers = db.offers;
const Tags = db.tags;
const Offer_Tags = db.offer_tags;
const path = require('path');

// Get a file
exports.getFile = async (req, res) => {
  console.log("Get File");
  let filePath = path.join(__dirname, "../data/", req.params.folder, "/", req.params.file);

  res.sendFile(filePath, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log('Sent:', filePath);
    }
  });
};

// Create an offer
exports.create = async (req, res) => {
  console.log("Create offer");
  const { companyName, name, description, icon, companyId } = req.body;

  // Validate input
  if (!(companyName && name && description && icon && companyId)) {
    return res.status(400).send("All input is required");
  }

  const offer = {
    companyName: companyName,
    name: name,
    description: description,
    icon: icon,
    companyId: companyId
  };

  Offers.create(offer)
    .then((value) => res.status(201).json({ value }))
    .catch(error => res.status(400).json({ error })
    );
};

exports.getAll = async (req, res) => {
  console.log(req.query.tag);

  try {
    if (!req.query.tag) {
      Offers.findAll({ include: { all: true, nested: true } }).then(offerList => {
        return res.status(200).json(offerList);
      });
    }
    else {
      Offers.findAll({
        where: { '$offer_tags.tag.label$': req.query.tag },
        include: [
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
  }
  catch (err) {
    return res.status(500).send(err.message);
  }
};

// Create a tag
exports.createTag = async (req, res) => {
  const { label } = req.body;

  // Validate input
  if (!(label)) {
    return res.status(400).send("All input is required");
  }

  //Check if Tag already exists
  const checkTag = await Tags.findOne({
    where: {
      label: label,
    },
  });

  if (checkTag) {
    return res.status(409).send("Tag Already Exist.");
  }

  const tag = {
    label: label,
  };

  Tags.create(tag)
    .then((value) => res.status(201).json({ value }))
    .catch(error => res.status(400).json({ error })
    );
};

// Find a single Tag with an id
exports.findTagById = async (req, res) => {
  const id = req.params.id;

  try {
    const tag = await Tags.findOne({
      where: {
        id: id,
      }
    });

    if (tag) {
      return res.send(tag);
    } else {
      return res.status(404).send(`Aucun Tag trouvé pour l'id ${id}`);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Retrieve all Tags.
exports.findAllTags = async (req, res) => {
  try {
    const tags = await Tags.findAll();
    return res.send(tags);
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