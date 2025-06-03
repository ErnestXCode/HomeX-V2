const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { validationResult } = require("express-validator");

const createUser = async (req, res) => {

  // const result = validationResult()

  const content = req.body;
  const { name, email, phoneNumber, password } = content;

  if (!name || !email || !phoneNumber || !password)
    return res.status(400).json({ error: "All inputs are mandatory" });





  try {
    // look for duplicate and retiurn something 409 conflict
    const duplicateUser = await User.findOne({ email });
    if (duplicateUser) return res.json("user already exists").status(409); //look for the appropriate status for conflict

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const roles = Object.values(content.roles).filter(Boolean);
    if (!roles) return res.json("invalid or no roles").status(409);

    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "2d",
    });
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2d",
    });

    // can add roles later if i feel like it

    const userCreated = await new User({
      ...content,
      password: hashedPassword,
      refreshToken,
    });
    await userCreated.save();

    res
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ roles, accessToken });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Could not create user", err });
  }
};

const addShortLists = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.sendStatus(401);

  const shortList = req.body.houseId;
  if (!shortList) return res.sendStatus(204);
  const shortlistArray = user.shortLists
if(shortlistArray.includes(shortList)) return res.json('duplicate')


  const shortListsArray = user.shortLists;
  console.log("shortlistArray", shortListsArray);

  user.shortLists = [...shortListsArray, shortList];
  console.log("user again ", user);

  const result = await user.save();

  console.log(result);
  res.status(200).json(result);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: false });
    res.status(201).json(users);
  } catch (err) {
    res.json({ message: "Failed to get all users", err });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const profile = req.user;
    res.status(200).json(profile);
  } catch (err) {
    res.status(404).json({ message: "User not found", err });
  }
};

const updateUser = async (req, res) => {
  try {
    const content = req.user;
    const id = content._id;
    const userInfo = req.body;
    await User.findByIdAndUpdate(id, { ...content, userInfo }, { new: true });
    res.status(200).json("updated succesfully");
  } catch (err) {
    res.status(404).json({ message: "Failed to update user", err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.user._id;
    const roles = req.user.roles;
    // make sure you cant delete an admin

    await User.findByIdAndDelete(id, { new: true });
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json("deleted succesfully");
  } catch (err) {
    res.status(403).json({ message: "Failed to delete user", err });
  }
};

const deleteUserbyAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id, { new: true }); // remember to remove visibility of password
    res.status(200).json("deleted succesfully");
  } catch (err) {
    res.status(403).json({ message: "Failed to delete user", err });
  }
};

module.exports = {
  createUser,
  deleteUserbyAdmin,
  getAllUsers,
  getCurrentUserProfile,
  updateUser,
  deleteUser,
  addShortLists,
};
