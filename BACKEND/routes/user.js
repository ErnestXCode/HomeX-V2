const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
} = require("../controllers/userController");
const handleAuth = require("../middleware/handleAuth");
const handleAdminAuth = require("../middleware/handleAdminAuth");

const router = express.Router();

router
  .route("/users")
  .get(handleAuth, handleAdminAuth, getAllUsers)
  .post(createUser);
router
  .route("/profile") // no need for users/:id due to req.user_id
  .get(handleAuth, getCurrentUserProfile)
  .put(handleAuth, updateUser)
  .delete(handleAuth, deleteUser);

module.exports = router;
