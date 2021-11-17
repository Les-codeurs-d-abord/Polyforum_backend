module.exports = app => {
    const users = require("../controllers/login.controller.js");
  
    const router = require("express").Router();
  
    router.get("/signin", users.getToken);
  
    app.use('/api/login', router);
  };