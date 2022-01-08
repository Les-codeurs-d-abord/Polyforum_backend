const express = require("express");
const path = require('path');

// App
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("Drop and re-sync db.");
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to les copains d'abord's application." });
});

require("./routes/user.routes")(app);
require("./routes/login.routes")(app);

//debug
require("./routes/debug.routes")(app);


app.get("/data/:folder/:file", (req, res) => {
  let filePath = path.join(__dirname, "/data/", req.params.folder, "/", req.params.file);

  res.sendFile(filePath, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log('Sent:', filePath);
    }
  });
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

