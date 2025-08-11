const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token cookie" });
    }

    // Find user by refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      return res.status(403).json({ error: "Refresh token not recognized" });
    }

    // Verify the token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err || decoded.email !== foundUser.email) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      // Create new access token
      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        roles: foundUser.roles,
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1m",
      });

      // Create new refresh token
      const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      // Save new refresh token and overwrite old one
     await User.findByIdAndUpdate(
  foundUser._id,
  { refreshToken: newRefreshToken }
);


      // Send cookie with new refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send back access token and roles
      const roles = Object.values(foundUser.roles).filter(Boolean);
      res.status(200).json({ accessToken, roles });
    });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleRefreshToken };
