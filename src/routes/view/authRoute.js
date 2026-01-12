"use strict";
const router = require("express").Router();

const User = require("../../controllers/view/userController");

router.route("/login").post(User.login).get(User.login);
// Handle logout (POST since it involves action)
router.get("/logout", User.logout);
// Create a new user
router.route("/register").post(User.register).get(User.register);

module.exports = router;
