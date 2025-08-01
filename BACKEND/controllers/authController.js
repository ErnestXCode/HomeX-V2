const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cookies = req.cookies;

    if (!email || !password) {
      return res.status(400).json({ error: "All credentials are mandatory" });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const verifiedPassword = await bcrypt.compare(password, foundUser.password);
    if (!verifiedPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = {
      id: foundUser._id,
      email: foundUser.email,
      roles: foundUser.roles,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((token) => token !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundTokenUser = await User.findOne({ refreshToken: { $in: [refreshToken] } });

      if (!foundTokenUser) {
        console.log("⚠️ Refresh token reuse detected at login");
        newRefreshTokenArray = []; // Token stolen or reused
      }

      // Clear old cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV !== "development",
      });
    }

    // Save the new refresh token
    const updatedUser = await User.findByIdAndUpdate(
      foundUser._id,
      { refreshToken: [...newRefreshTokenArray, newRefreshToken] },
      { new: true }
    );

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      roles: Object.values(updatedUser.roles).filter(Boolean),
      accessToken,
      shortLists: updatedUser.shortLists,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logOutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.sendStatus(204); // No content

    const foundUser = await User.findOne({ refreshToken: { $in: [refreshToken] } }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV !== "development",
      });
      return res.sendStatus(204);
    }

    const updatedTokens = foundUser.refreshToken.filter(
      (token) => token !== refreshToken
    );

    await User.findByIdAndUpdate(
      foundUser._id,
      { refreshToken: updatedTokens },
      { new: true }
    );

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { loginUser, logOutUser };
