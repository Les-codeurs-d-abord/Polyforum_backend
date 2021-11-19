module.exports = app => {
    const login = require("../controllers/login.controller.js");
  
    const router = require("express").Router();
  
    const auth = require("../middleware/auth");

    router.get("/signin", login.getToken);

    router.get("/info", auth, login.getInfo);
  
    app.use('/api/login', router);
  };