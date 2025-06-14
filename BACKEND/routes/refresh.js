const express = require("express");
const { handleRefreshToken } = require("../controllers/refreshTokenController");

const router = express.Router();

router.route("/refresh").get(handleRefreshToken);

module.exports = router;
