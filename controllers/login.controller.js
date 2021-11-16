const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const KEY = "HSNDKAJZRIWKNARHSKXH";

exports.getToken = async (req, res) => {
    const { username, password } = req.body;

    console.log(username + " " + password);

    if(!req.body.username || !req.body.password) {
      return res.status(400).send("Username or password empty.");
    }
  
/*     var payload = {
      username: req.body.username,
    };
    
    // console.log(req.body.username + " attempted login");
    var password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    var token = jwt.sign(payload, KEY, {algorithm: 'HS256', expiresIn: "15d"}); */
    return res.status(200).send("token");
};

exports.removeToken = async (req, res) => {
    return res.status(200).send("WIP - Remove token.");
};