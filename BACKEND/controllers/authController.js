const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  // const cookies = req.cookies;
  const { email, password } = req.body;
  const cookies = req.cookies;

  if (!email || !password) {
    return res.status(400).json({ error: "All Credentials Are Mandatory" });
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) return res.status(400).json({ error: "User Does Not Exist" });

  const verifiedPassword = await bcrypt.compare(password, foundUser.password);
  if (!verifiedPassword)
    return res.status(400).json({ error: "invalid credentials" });

  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2d",
  });
  const newRefreshToken = jwt.sign(
    { email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2d",
    }
  );

  // i wonder after how long i shoud require them to log back in , security is important but id rather not annoy customers

  let newRefreshTokenArray = !cookies?.jwt
    ? foundUser.refreshToken
    : foundUser.refreshToken.filter((token) => token !== cookies.jwt);

  if (cookies?.jwt) {
    const refreshToken = cookies.jwt;
    const foundToken = await User.findOne({ refreshToken });
    if (!foundToken) {
      console.log("attempted refresh token reuse at login");
      newRefreshTokenArray = [];
    }

    res.cookie("jwt", "", {
      httpOnly: true,

      secure: process.env.NODE_ENV !== "development",
    });
  }

  const newArray = [...newRefreshTokenArray, newRefreshToken];
  await User.findByIdAndUpdate(
    foundUser._id,
    { refreshToken: newArray },
    {
      new: true,
    }
  );

  const roles = Object.values(foundUser.roles).filter(Boolean);
  const shortLists = foundUser.shortLists;
  res
    .cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ roles, accessToken, shortLists });
};

const logOutUser = async (req, res) => {
  // delete accessToken on client side
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) return res.sendStatus(204); // no content
  // find user in db with the refreshToken and clear cookie if user is not found pia
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) return res.sendStatus(204);
  const newArray = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );
  await foundUser.findByIdAndUpdate(
    foundUser._id,
    { refreshToken: newArray },
    { new: true }
  );
  // cookie is not clearing
  res
    .clearCookie("jwt", {
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
