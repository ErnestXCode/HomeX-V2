const express = require("express");
const {
  getAllAreas,
  createArea,
  getArea,
  updateArea,
  deleteArea,
} = require("../controllers/areaController");
const handleAuth = require("../middleware/handleAuth");
const handleAdminAuth = require("../middleware/handleLandLord");
const handleCache = require("../middleware/handleCache");

const router = express.Router();

router
  .route("/areas")
  .get(getAllAreas)
  .post(createArea);
router
  .route("/areas/:id")
  .get(getArea)
  .put(updateArea)
  .delete(deleteArea);

module.exports = router;
