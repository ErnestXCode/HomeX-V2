const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All Credentials Are Mandatory" });
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) return res.status(400).json({ error: "User Does Not Exist" });

  const verifiedPassword = await bcrypt.compare(password, foundUser.password);
  console.log("verifiedPassword", verifiedPassword);
  if (!verifiedPassword)
    return res.status(400).json({ error: "invalid credentials" });
  
  const accessToken = jwt.sign(
    { username: foundUser.name },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "60s",
    }
  );
  const refreshToken = jwt.sign(
    { username: foundUser.name },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  console.log(result);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    // look what samesite does maybe its important
    sameSite: 'None',
    secure: process.env.NODE_ENV !== "development",
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ accessToken });
};

const logOutUser = async (req, res) => {
  // delete accessToken on client side

  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) return res.sendStatus(204); // no content

  // find user in db with the refreshToken and clear cookie if user is not found pia
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) return res.sendStatus(204);

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res
    .cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    })
    .status(200)
    .json({ message: "Logged Out Successfully" });
};

module.exports = { loginUser, logOutUser };
