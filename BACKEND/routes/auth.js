const express = require("express");
const { logOutUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(loginUser);

router.route("/logout").post(logOutUser);

module.exports = router;
