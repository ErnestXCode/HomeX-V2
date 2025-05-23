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

const router = express.Router();

router
  .route("/areas")
  .get(getAllAreas)
  .post(handleAuth, verifyRoles(["admin"]), createArea);
router
  .route("/areas/:id")
  .get(handleAuth, getArea)
  .put(handleAuth, verifyRoles(["admin"]), updateArea)
  .delete(handleAuth, verifyRoles(["admin"]), deleteArea);

module.exports = router;
