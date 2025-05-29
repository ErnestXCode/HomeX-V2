const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
  deleteUserbyAdmin,
  addShortLists,
} = require("../controllers/userController");
const handleAuth = require("../middleware/handleAuth");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");
const { body } = require("express-validator");

const router = express.Router();

router
  .route("/users")
  .get(handleAuth, verifyRoles(ROLES_LIST.admin), getAllUsers)
  .post(
    // body("email").notEmpty().withMessage("email must not be empty").isEmail(),
    // with meassage for after any function
    // body("password").notEmpty().withMessage("password must not be empty").isLength({min: 5}) ,
    createUser
  );

router
  .route("/users/:id")
  .delete(handleAuth, verifyRoles(ROLES_LIST.admin), deleteUserbyAdmin);

router
  .route("/profile") // no need for users/:id due to req.user_id
  .get(handleAuth, getCurrentUserProfile)
  .post(handleAuth, addShortLists)
  .put(handleAuth, updateUser)
  .delete(handleAuth, deleteUser);

module.exports = router;
