const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  console.log("refreshToken from refresh", refreshToken);
  if (!refreshToken) return res.json("ii kitu si iitikie sasa").status(401); // unauthorized
  // res.cookie("jwt", "", {
  //   sameSite: "Lax",
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== "development",
  //   maxAge: new Date(0),
  // });

  const user = await User.findOne({ refreshToken }).exec() // look for a person whho has the refresh token
  if (!user) return res.json({ message: "USER AKONA SHIDA" });

  const userId = user._id;

  // detected refresh token reuse

  if (!user) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findById(decoded.userId);
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    );
  }

  const newRefreshTokenArray = user?.refreshToken.filter(
    (token) => token !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        user.refreshToken = [...newRefreshTokenArray];
        const result = await user.save();
        console.log("from error", result);
        return res.sendStatus(403);
      }
    }
  );
  // refresh token is still valid
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

  user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  const result = await user.save();

  const roles = Object.values(user.roles).filter(Boolean);

  res
    .cookie("jwt", newRefreshToken, {
      httpOnly: true,
      // look what be its important
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .json({ roles, accessToken })
    .status(200);
  // why is it displaying jwt twice

  // THIS IS THE ERROR WHEN I USE THIS REFRESH TWICE INN A ROW IN FRONTEND, but no issue when using it with postman and thunderclient
  // VersionError: No matching document found for id "6832639170366391392c60ff" version 25 modifiedPaths "refreshToken"
  //     at generateVersionError (C:\Users\HP\Desktop\HomeX\node_modules\mongoose\lib\model.js:572:10)
  //     at model.save (C:\Users\HP\Desktop\HomeX\node_modules\mongoose\lib\model.js:630:28)
  //     at handleRefreshToken (C:\Users\HP\Desktop\HomeX\BACKEND\controllers\refreshTokenController.js:69:37)
  //     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
};

module.exports = { handleRefreshToken };
