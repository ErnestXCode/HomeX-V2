const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
  deleteUserbyAdmin,
} = require("../controllers/userController");
const handleAuth = require("../middleware/handleAuth");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
  .route("/users")
  .get(handleAuth, verifyRoles(["admin"]), getAllUsers)
  .post(createUser);

router.route("/users/:id").delete(handleAuth, verifyRoles(["admin"]), deleteUserbyAdmin);

router
  .route("/profile") // no need for users/:id due to req.user_id
  .get(handleAuth, getCurrentUserProfile)
  .put(handleAuth, updateUser)
  .delete(handleAuth, deleteUser);

module.exports = router;
