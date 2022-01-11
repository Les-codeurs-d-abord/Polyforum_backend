const db = require("../models");
const Tags = db.tags;

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