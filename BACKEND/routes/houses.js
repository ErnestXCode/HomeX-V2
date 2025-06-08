const express = require("express");
const {
  getAllHouses,
  createHouse,
  markAsTaken,
  updateHouse,
  deleteHouse,
  getHouseById,
  getShortLists,
  getLAndlordsHouses,
  updateHouseStatus,
} = require("../controllers/houseController");
const handleAuth = require("../middleware/handleAuth");
const upload = require("../middleware/handleUploads");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");  

const router = express.Router();

router.route("/houses").get(getAllHouses).post(
  // handleAuth,
  // verifyRoles(ROLES_LIST.admin, ROLES_LIST.landlord),
  upload.array("images", 3),
  createHouse
);

router.route("/shortlists").get(handleAuth, getShortLists);
router.route("/landlordHouses").get(handleAuth, getLAndlordsHouses);
router
  .route("/verify")
  .post(handleAuth, updateHouseStatus)
  .get(handleAuth, markAsTaken);

router
  .route("/houses/:id")
  .get(getHouseById)
  .put(
    handleAuth,
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.landlord),
    updateHouse
  )
  .delete(
    handleAuth,
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.landlord),
    deleteHouse
  ); //landlord middleware

module.exports = router;
