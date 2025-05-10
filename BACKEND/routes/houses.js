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
const handleLandLord = require("../middleware/handleLandLord");
const upload = require("../middleware/handleUploads");

const router = express.Router();

router
  .route("/houses")
  .get( getAllHouses)
  .post(upload.array('images', 3), createHouse);

router
  .route("/houses/:id")
  .get(getHouseById)
  .put( updateHouse)
  .delete( deleteHouse); //landlord middleware

router.route("/houses/area/:area").get(getHouseByArea);

module.exports = router;
