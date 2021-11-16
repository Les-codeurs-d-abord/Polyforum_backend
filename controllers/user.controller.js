const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

exports.getToken = async (req, res) => {
    print("test");
    return res.send("Oui");
};

// Create a user
exports.create = async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };

    try {
        const savedUser = await User.create(user);
        return res.send(savedUser);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.send(users);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

// Find a single User with an id
exports.findById = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id);

        if (user) {
            return res.send(user);
        } else {
            return res.status(404).send(`Aucun utilisateur trouvé pour l'id ${id}`);
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

// Update a User by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    const updateContent = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age
    }

    try {
        const test = await User.update(updateContent, {
            where: { id: id }
        });
        console.log(test)
        if (test > 0) {
            return res.send({ message: `Utilisateur ${id} mis à jour` });
        } else {
            return res.send({ message: `Aucune mise à jour pour l'utilisateur ${id}` });
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

// Delete a User by the id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const deleteCount = await User.destroy({
            where: { id: id }
        });
        if (deleteCount === 1) {
            return res.send({ message: `Utilisateur ${id} supprimé` });
        } else {
            return res.send({ message: `Suppression impossible pour l'utilisateur ${id}` });
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

// Find all admins (exemple)
exports.findAllAdmins = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                role: {
                    [Op.eq]: 'ADMIN'
                }
            }
        });
        return res.send(users);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};