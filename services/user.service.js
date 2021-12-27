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

    bcrypt.hash(password, saltRounds)
        .then(hash => {
            const user = {
                email: email,
                password: hash,
                role: role
            };

            User.create(user)
                .then((createdUser) => { return createdUser.toJSON() })
                .catch(error => { throw new Error(error.message) });
        })
        .catch(error => { throw new Error(error.message) });

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
