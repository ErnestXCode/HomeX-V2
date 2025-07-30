const express = require("express");
const callbackController = require("../controllers/tokenCallback");

const router = express.Router();

router.route("/callback").post(callbackController);

module.exports = router;
