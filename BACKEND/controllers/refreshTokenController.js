const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  console.log("refreshToken from refresh", refreshToken);
  if (!refreshToken) return res.json("ii kitu si iitikie sasa").status(401); // unauthorized
  res.clearCookie("jwt", {
    sameSite: "Lax",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

  const user = await User.findOne({ refreshToken });
  // refreshToken is an array and were looking for a stringp
  if (!user) return res.json({ message: "USER AKONA SHIDA" });

  const userId = user?._id;
  const email = user?.email;
  if (!email) return res.json("no email found");

  // detected refresh token reuse

  // if (!user) {
  //   jwt.verify(
  //     refreshToken,
  //     process.env.REFRESH_TOKEN_SECRET,
  //     async (err, decoded) => {
  //       if (err) return res.sendStatus(403);
  //       const hackedUser = await User.findById(decoded.userId);
  //       hackedUser.refreshToken = [];
  //       await hackedUser.save();
  //     }
  //   );
  // }

  const newRefreshTokenArray = user?.refreshToken.filter(
    (token) => token !== refreshToken
  );

  // const goodRefreshToken = jwt.verify(
  //   refreshToken,
  //   process.env.REFRESH_TOKEN_SECRET
  // );
  // if (!goodRefreshToken)
  //   return res.json({ message: "good refresh token ni mbaya" }).status(409);

  // async (err, decoded) => {
  //   if (err) {
  //     // user.refreshToken = [...newRefreshTokenArray];
  //     const result = await user.save();
  //     console.log("from error", result);
  //     return res.sendStatus(403);
  //   }

  // refresh token is still valid
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

  const oldRefreshToken = refreshToken

  // user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

  // bado sijatoa refreshToken ilikua inatumika
  const result = await User.findByIdAndUpdate(userId, {
    $push: { refreshToken: newRefreshToken },
  });
  console.log(result);

  const roles = Object.values(user.roles).filter(Boolean);
  const shortLists = user.shortLists;

  res
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      // look what be its important
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .json({ roles, accessToken, shortLists })
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
