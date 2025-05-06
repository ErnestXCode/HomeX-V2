const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const handleToken = require("../middleware/handleToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All Credentials Are Mandatory" });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User Does Not Exist" });

  const verifiedPassword = await bcrypt.compare(password, user.password);
  if (!verifiedPassword)
    return res.status(400).json({ error: "invalid credentials" });

  handleToken(res, user.id);
  res.status(200).json(user);
};

const logOutUser = async (req, res) => {
  res
    .cookie("jwt", "", {
      httpOnly: true,
      secure: false,
      expiresIn: new Date(0),
    })
    .status(200)
    .json({ message: "Logged Out Successfully" });
};

module.exports = { loginUser, logOutUser };
