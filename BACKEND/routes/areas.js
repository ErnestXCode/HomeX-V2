const express = require("express");
const {
  getAllAreas,
  createArea,
  getArea,
  updateArea,
  deleteArea,
} = require("../controllers/areaController");
const handleAuth = require("../middleware/handleAuth");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");

const router = express.Router();
// handleAuth, verifyRoles(ROLES_LIST.admin), 
router
.route("/areas")
.get(getAllAreas)
.post(createArea);
router
  .route("/areas/:id")
  .get(handleAuth, getArea)
  .put(handleAuth, verifyRoles(ROLES_LIST.admin), updateArea)
  .delete(handleAuth, verifyRoles(ROLES_LIST.admin), deleteArea);

module.exports = router;
