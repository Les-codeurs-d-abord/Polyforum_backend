const db = require("../models");
const User = db.users;

exports.createUser = async (email, role) => {
    const password = generatePassword(25);

    const user = {
        email: email,
        role: role,
        password: password,
    };

    try {
        const savedUser = await User.create(user);
        return savedUser;
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
