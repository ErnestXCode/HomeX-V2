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
const handleAdminAuth = require("../middleware/handleAdminAuth");

const router = express.Router();

router
  .route("/users")
  .get(getAllUsers)
  .post(createUser);

router.route('/users/:is').delete(deleteUserbyAdmin)

router
  .route("/profile") // no need for users/:id due to req.user_id
  .get(handleAuth, getCurrentUserProfile)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
