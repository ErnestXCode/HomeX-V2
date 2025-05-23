const express = require("express");
const {
  getAllHouses,
  createHouse,
  updateHouse,
  deleteHouse,
  getHouseByArea,
  getHouseById,
} = require("../controllers/houseController");
const handleAuth = require("../middleware/handleAuth");
const upload = require("../middleware/handleUploads");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
  .route("/houses")
  .get(getAllHouses)
  .post(
    handleAuth,
    verifyRoles(["admin", "landlord"]),
    upload.array("images", 3),
    createHouse
  );

router
  .route("/houses/:id")
  .get(getHouseById)
  .put(handleAuth, verifyRoles(["admin", "landlord"]), updateHouse)
  .delete(handleAuth, verifyRoles(["admin", "landlord"]), deleteHouse); //landlord middleware

router.route("/houses/area/:area").get(getHouseByArea);

module.exports = router;
