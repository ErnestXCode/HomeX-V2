const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  console.log("\n=== STARTED REFRESH HANDLER ===");
  console.log("RAW COOKIE HEADER:", req.headers.cookie);
  console.log("PARSED COOKIES:", JSON.stringify(req.cookies));

  try {
    const refreshToken = req.cookies?.jwt;
    console.log("COOKIE RECEIVED FROM CLIENT:", JSON.stringify(refreshToken));

    if (!refreshToken) {
      console.log("No refresh token in request cookies.");
      return res.status(401).json({ error: "Missing refresh token" });
    }

    const foundUser = await User.findOne({
      refreshToken: { $in: [refreshToken] },
    });

    console.log(
      "USER FOUND?",
      !!foundUser,
      foundUser ? `DB TOKENS: ${JSON.stringify(foundUser.refreshToken)}` : ""
    );

    if (!foundUser) {
      console.log("No user matches the refresh token.");
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.email !== foundUser.email) {
          console.log("Invalid token or email mismatch.");
          return res.sendStatus(403);
        }

        const payload = {
          id: foundUser._id,
          email: foundUser.email,
          roles: foundUser.roles,
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1d",
        });

        const roles = Object.values(foundUser.roles).filter(Boolean);
        const shortLists = foundUser.shortLists;

        console.log("=== END REFRESH HANDLER ===");
        return res.status(200).json({ roles, accessToken, shortLists });
      }
    );
  } catch (err) {
    console.error("Error in refresh token handler:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleRefreshToken };
