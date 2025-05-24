const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) return res.sendStatus(401); // unauthorized
  res.clearCookie("jwt", "", {
    httpOnly: true,
    // look what samesite does maybe its important
    secure: process.env.NODE_ENV !== "development",
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

  const user = await User.findOne({ refreshToken }); // look for a person whho has the refresh token

  // detected refresh token reuse

  if (!user) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findById(decoded.userId);
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    );
  }

  const newRefreshTokenArray = user.refreshToken.filter(
    (token) => token !== refreshToken
  );

  const userId = user._id;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        user.refreshToken = [...newRefreshTokenArray];
        const result = await user.save();
        return res.sendStatus(403);
      }
    }
  );
  // refresh token is still valid
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60s",
  });

  const newRefreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2d",
    }
  );

  user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  const result = await user.save();
  console.log(result);

  res
    .cookie("jwt", newRefreshToken, {
      httpOnly: true,
      // look what samesite does maybe its important
      secure: process.env.NODE_ENV !== "development",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .json({ accessToken })
    .status(200);
    // why is it displaying jwt twice
};

module.exports = { handleRefreshToken };
