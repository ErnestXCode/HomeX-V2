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

    // 🔒 Token reuse / no-user case
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            console.log("Invalid token, cannot decode:", err?.message || "");
            return;
          }
          console.log("VALID TOKEN BUT NO USER:", decoded.email);

          // purge tokens for the decoded email if any
          const hackedUser = await User.findOne({ email: decoded.email }).exec();
          if (hackedUser) {
            hackedUser.refreshToken = [];
            hackedUser.markModified("refreshToken");
            await hackedUser.save();
            console.log("Cleared all tokens for hacked user.");
          }
        }
      );

      // only clear cookie when token is invalid or not present in DB
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV !== "development",
      });
      console.log("CLEARED COOKIE FOR NO USER");
      return res.sendStatus(403);
    }

    // 🔑 Verify token and issue replacements (keeps original flow)
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || decoded.email !== foundUser.email) {
          // invalidate client cookie on failure
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "Lax",
            secure: process.env.NODE_ENV !== "development",
          });
          console.log("TOKEN INVALID OR MISMATCH EMAIL");
          return res.sendStatus(403);
        }

        // filter out the used token (works for array)
        const newRefreshTokenArray = foundUser.refreshToken.filter(
          (token) => token !== refreshToken
        );

        const payload = {
          id: foundUser._id,
          email: foundUser.email,
          roles: foundUser.roles,
        };

        console.log("BEFORE TOKEN GENERATION");
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "10s",
        });

        const newRefreshToken = jwt.sign(
          payload,
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        // save replacement token (ensure Mongoose notices array change)
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        foundUser.markModified("refreshToken");
        await foundUser.save();

        console.log("COOKIE JUST SET:", JSON.stringify(newRefreshToken));
        console.log(
          "DB TOKEN ARRAY AFTER SAVE:",
          JSON.stringify(foundUser.refreshToken)
        );

        // set cookie with original options you asked to keep
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "Lax",
          secure: process.env.NODE_ENV !== "development",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        console.log("COOKIE SENT TO CLIENT");

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
