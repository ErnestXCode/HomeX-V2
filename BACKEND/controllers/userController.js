const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const createUser = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  if (!name || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: "All inputs are mandatory" });
  }

  try {
    const duplicateUser = await User.findOne({ email });
    if (duplicateUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    const payload = { email };

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      refreshToken,
    });

    const createdUser = await newUser.save();
    const roles = Object.values(createdUser.roles).filter(Boolean);

    res
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ roles, accessToken, shortLists: [] });
  } catch (err) {
    console.error("User creation failed:", err);
    res.status(500).json({ error: "User creation failed", err });
  }
};

const addShortLists = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.sendStatus(401);

    const shortList = req.body.houseId;
    if (!shortList) return res.sendStatus(204);

    if (user.shortLists.includes(shortList)) {
      return res.status(409).json({ message: "Already shortlisted" });
    }

    user.shortLists.push(shortList);
    await user.save();

    res.status(200).json({ message: "Shortlist updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update shortlist", err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, refreshToken: 0 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to get all users", err });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const profile = req.user;
    res.status(200).json(profile);
  } catch (err) {
    res.status(404).json({ error: "User not found", err });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    let updatedPassword = currentUser.password;

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, currentUser.password);
      if (!isMatch) {
        return res.status(403).json({ error: "Old password incorrect" });
      }

      updatedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt());
    }

    currentUser.name = name || currentUser.name;
    currentUser.password = updatedPassword;

    await currentUser.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id, roles } = req.user;

    if (roles?.Admin) {
      return res.status(403).json({ error: "Admins cannot delete themselves" });
    }

    await User.findByIdAndDelete(_id);

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", err });
  }
};

const deleteUserbyAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted by admin successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user by admin", err });
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
