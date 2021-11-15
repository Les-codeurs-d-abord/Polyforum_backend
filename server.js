const express = require("express");

// App
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to les copains d'abord's application." });
});

require("./app/routes/user.routes")(app);

var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const KEY = "m yincredibl y(!!1!11!)<'SECRET>)Key'!";

// app.get("/signup", (req, res) => {

// });

app.get("/signin", (req, res) => {
  console.log(req.body.username + " " + req.body.password);
  if(!req.body.username || !req.body.password) {
    return res.status(400).send("Username or password empty.");
  }

  var payload = {
    username: req.body.username,
  };
  
  // console.log(req.body.username + " attempted login");
  var password = crypto.createHash('sha256').update(req.body.password).digest('hex');
  var token = jwt.sign(payload, KEY, {algorithm: 'HS256', expiresIn: "15d"});
  return res.status(200).send(token);
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

