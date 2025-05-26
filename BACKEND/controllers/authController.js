const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "All Credentials Are Mandatory" });
//   }
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ error: "User Does Not Exist" });

//   const verifiedPassword = await bcrypt.compare(password, user.password);
//   if (!verifiedPassword)
//     return res.status(400).json({ error: "invalid credentials" });

//   const userId = user._id;

//   const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "30d",
//   });
//   res
//     .cookie("jwt", token, {
//  sameSite: 'Lax',      httpOnly: true,
// secure: process.env.NODE_ENV !== "development",
//       maxAge: 2 * 24 * 60 * 60 * 1000,
//     })
//     .status(200)
//     .json(user);
// };

const loginUser = async (req, res) => {
  // const cookies = req.cookies;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All Credentials Are Mandatory" });
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) return res.status(400).json({ error: "User Does Not Exist" });

  const userId = foundUser._id;

  const verifiedPassword = await bcrypt.compare(password, foundUser.password);
  if (!verifiedPassword)
    return res.status(400).json({ error: "invalid credentials" });

  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2d",
  });
  const newRefreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2d",
    }
  );

  let newRefreshTokenArray = foundUser.refreshToken;

  // let newRefreshTokenArray = !cookies?.jwt
  //   ? foundUser.refreshToken
  //   : foundUser.refreshToken.filter((token) => token !== cookies.jwt);

  // if (cookies?.jwt) {
  //   const refreshToken = cookies.jwt;
  //   const foundToken = await User.findOne({ refreshToken });
  //   if (!foundToken) {
  //     console.log("attempted refresh token reuse at login");
  //     newRefreshTokenArray = [];
  //   }

  //   res.cookie("jwt", "", {
  //     httpOnly: true,

  //     secure: process.env.NODE_ENV !== "development",
  //   });
  // }

  foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  const result = await foundUser.save();

  const roles = Object.values(foundUser.roles).filter(Boolean);

  res
    .cookie("jwt", newRefreshToken, {
      httpOnly: true,
      // look what samesite: 'Lax', does maybe its important
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ roles, accessToken });
};

const logOutUser = async (req, res) => {
  // delete accessToken on client side
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) return res.sendStatus(204); // no content

  // find user in db with the refreshToken and clear cookie if user is not found pia
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) return res.sendStatus(204);

  foundUser.refreshToken = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );

  const result = await foundUser.save();

  // cookie is not clearing

  res
    .cookie("jwt", "", {
      httpOnly: true,
      // look what samesite: 'Lax', does maybe its important
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ message: "Logged Out Successfully" });
};

module.exports = { loginUser, logOutUser };
