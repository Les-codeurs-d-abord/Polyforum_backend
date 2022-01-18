const express = require("express");

// App
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const db = require("./models");
db.sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("Drop and re-sync db.");
});

require("./routes/user.routes")(app);
require("./routes/company.routes")(app);
require("./routes/candidate.routes")(app);
require("./routes/login.routes")(app);
require("./routes/offer.routes")(app);
require("./routes/res.routes")(app);
require("./routes/planning.routes")(app);
require("./routes/wish_candidate.routes")(app);
require("./routes/wish_company.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
