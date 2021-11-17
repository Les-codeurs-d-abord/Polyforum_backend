module.exports = app => {
  const users = require("../controllers/user.controller.js");

  const router = require("express").Router();

  // Create a new User
  router.post("/signup", users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve all admins
  router.get("/admins", users.findAllAdmins);

  // Retrieve a single User with id
  router.get("/:id", users.findById);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  app.use('/api/users', router);
};