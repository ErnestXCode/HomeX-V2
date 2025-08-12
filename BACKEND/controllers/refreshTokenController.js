const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const handleRefreshToken = async (req, res) => {
    console.log("=== STARTED REFRESH HANDLER ===");

    // 1. Get cookie
    const cookies = req.cookies;
    const refreshToken = cookies?.jwt;
    console.log("COOKIE RECEIVED FROM CLIENT:", refreshToken || "undefined");

    if (!refreshToken) {
        console.log("No refresh token in cookies.");
        return res.sendStatus(401);
    }

    try {
        // 2. Find user with this refresh token
        const foundUser = await User.findOne({ refreshTokens: refreshToken }).exec();
        console.log("USER FOUND?", !!foundUser);

        if (!foundUser) {
            console.log("No user found for given refresh token -> Possible reuse attempt");
            res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
            return res.sendStatus(403);
        }

        // 3. Verify the token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log("REFRESH TOKEN VERIFIED FOR USER:", decoded.email);

        if (foundUser.email !== decoded.email) {
            console.log("Token email does not match user in DB");
            return res.sendStatus(403);
        }

        // 4. Generate new tokens
        console.log("BEFORE TOKEN GENERATION");
        const roles = foundUser.roles;

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    id: foundUser._id,
                    email: foundUser.email,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10s" }
        );

        const newRefreshToken = jwt.sign(
            { id: foundUser._id, email: foundUser.email, roles: roles },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // 5. Replace old token in DB with new one
        foundUser.refreshTokens = foundUser.refreshTokens.filter(rt => rt !== refreshToken);
        foundUser.refreshTokens.push(newRefreshToken);
        await foundUser.save();
        console.log("DB TOKEN ARRAY AFTER SAVE:", foundUser.refreshTokens);

        // 6. Send new cookie
        res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });
        console.log("COOKIE JUST SET:", newRefreshToken);

        // 7. Send access token
        console.log("=== END REFRESH HANDLER ===\n");
        res.json({ accessToken });

    } catch (err) {
        console.log("ERROR:", err.message);
        res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
        return res.sendStatus(403);
    }
};

module.exports = { handleRefreshToken };
