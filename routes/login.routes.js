module.exports = app => {
    const login = require("../controllers/login.controller.js");
  
    const router = require("express").Router();
  
    const auth = require("../middleware/auth");
    const cors = require("../middleware/cors");

    router.post("/signin", cors, login.getToken);

    router.get("/info", auth, cors, login.getInfo);
  
    app.use('/api/login', router);
  };