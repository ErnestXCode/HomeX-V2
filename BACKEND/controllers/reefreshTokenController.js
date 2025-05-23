const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) {
    return res.sendStatus(401); // unauthorized
  }
  const user = await User.findOne({ refreshToken }); // look for a person whho has the refresh token
  if (!user) return res.status(400).json({ error: "User Does Not Exist" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60s",
      }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
