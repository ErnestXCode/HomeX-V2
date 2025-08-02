const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) {
      return res.status(401).json({ error: "Missing refresh token" });
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
    });

    const foundUser = await User.findOne({ refreshToken: { $in: [refreshToken] } });

    // 🔒 Refresh token reuse attempt detected
    if (!foundUser) {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden

        // Purge all tokens for suspected reused token
        const hackedUser = await User.findOne({ email: decoded.email }).exec();
        if (hackedUser) {
          hackedUser.refreshToken = [];
          await hackedUser.save();
        }
      });
      return res.sendStatus(403);
    }

    // 🔑 Verify token validity
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err || decoded.email !== foundUser.email) {
        return res.sendStatus(403); // Token is expired or tampered
      }

      const newRefreshTokenArray = foundUser.refreshToken.filter(
        (token) => token !== refreshToken
      );

      // ✅ Token is valid → Issue new tokens
      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        roles: foundUser.roles,
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1m", // shorter access lifespan
      });

      const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d", // longer refresh lifespan
      });

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const roles = Object.values(foundUser.roles).filter(Boolean);
      const shortLists = foundUser.shortLists;

      return res.status(200).json({ roles, accessToken, shortLists });
    });
  } catch (err) {
    console.error("Error in refresh token handler:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleRefreshToken };
