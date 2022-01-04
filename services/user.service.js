const db = require("../models");
const User = db.users;

const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.createUser = async (email, role) => {

    //Check if user already exists
    const checkUser = await User.findOne({
        where: {
            email: email,
        },
    });

    if (checkUser) {
        throw new Error("User already exists.");
    }

    // TODO: Générer un "vrai" mot de passe
    const password = generatePassword(25);

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        const userData = {
            email: email,
            password: hash,
            role: role
        };
        const user = await User.create(userData);

        // throw new Error("monzbi");

        // Send an email to the company to give the password

        return { user, password };
    } catch (err) {
        throw new Error(err.message);
    }
};

generatePassword = (length) => {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var password = "";

    for (var i = 0; i <= length; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}
