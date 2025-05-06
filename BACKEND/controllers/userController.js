const User = require("../models/userModel");
const handleToken = require("../middleware/handleToken");

const createUser = async (req, res) => {
  const content = req.body;
  if (
    !content.name ||
    !content.email ||
    !content.phoneNumber ||
    !content.password
  )
    return res.status(400).json({ error: "All inputs are mandatory" });
  try {
    const userCreated = await new User(content);
    await userCreated.save();
    handleToken(res, userCreated._id);
    res.status(200).json(userCreated);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Could not create user", err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    res.json({ message: "Failed to get all users", err });
  }
};

const getCurrentUserProfile = async (req, res) => {
  // previously getUserById
  try {
    const profile = req.user;
    res.status(200).json(profile);
  } catch (err) {
    res.status(404).json({ message: "User not found", err });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.user._id;
    const userInfo = req.body;
    const user = await User.findByIdAndUpdate(id, userInfo, { new: true }); // remember to remove visibility of password
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: "Failed to update user", err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.user._id;
    await User.findByIdAndDelete(id, { new: true }); // remember to remove visibility of password
    res.status(200).json("deleted succesfully");
  } catch (err) {
    res.status(403).json({ message: "Failed to delete user", err });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getCurrentUserProfile,
  updateUser,
  deleteUser,
};
