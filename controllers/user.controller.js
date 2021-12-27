const db = require("../models");
const User = db.users;
const CompanyProfile = db.company_profiles;
const Op = db.Sequelize.Op;

const UserService = require("../services/user.service");
const CompanyProfileService = require("../services/company_profile.service");


// Create a company
exports.createCompany = async (req, res) => {
    const email = req.body.email;
    const companyName = req.body.companyName;

    if (!(email && companyName)) {
        return res.status(400).send("Au moins un champs manquant parmi [email, companyName]");
    }

    try {
        const companyUser = await UserService.createUser(email, User.ROLES.COMPANY);
        console.log("Company created : ", user.toJSON())
        const companyProfile = await CompanyProfileService.createCompanyProfile(companyUser.id, companyName);
        console.log("Company profile created : ", companyProfile.toJSON())
        return res.status(201).send(user)
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

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
        email: req.body.email,
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

// Find all admins
exports.findAllAdmins = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                role: {
                    [Op.eq]: User.ROLES.ADMIN
                }
            }
        });
        return res.send(users);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};


// Find all companies
exports.findAllCompanies = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                role: {
                    [Op.eq]: User.ROLES.COMPANY
                }
            }
        });
        return res.send(users);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

exports.companyList = async (req, res) => {
    try {
        const company_profiles = await CompanyProfile.findAll({
            include: [{
                model: User,
                attributes: ['id', 'email'],
            }],
            attributes: ['companyName', 'logo']
        });
        return res.send(company_profiles);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}