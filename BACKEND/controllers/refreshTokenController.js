const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  console.log("cookies", req.cookies);
  if (!refreshToken) return res.json("ii kitu si iitikie sasa").status(401); // unauthorized
  res.clearCookie("jwt", {
    sameSite: "Lax",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

  

  // const user = await User.findById(new mongoose.Types.ObjectId('6844a8f2e467484e53846034'));
  const user = await User.findOne({refreshToken}).exec()
  console.log('user', user, 'refresh', refreshToken)
  // refreshToken is an array and were looking for a stringp
  if (!user) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findOne({email : decoded.email}).exec()
        if(!hackedUser) console.log('ni kama im hacked user')
        const UpdatedHackedUser = await User.findByIdAndUpdate(hackedUser._id, {refreshToken : [] }, {new : true})
        if(!UpdatedHackedUser) console.log('ni kama im hakuna updated one')
          console.log(UpdatedHackedUser)
      }
    )
  }

  const userId = user?._id;
  const email = user?.email;
  if (!email) return res.json("no email found");

  // detected refresh token reuse

  const newRefreshTokenArray = user?.refreshToken.filter(
    (token) => token !== refreshToken
  );

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

  const newArray = [...newRefreshTokenArray, newRefreshToken];

  // bado sijatoa refreshToken ilikua inatumika
  const result = await User.findByIdAndUpdate(userId, {
    refreshToken: newArray,
  }, {new: true});
  console.log(result);

  const roles = Object.values(user.roles).filter(Boolean);
  const shortLists = user.shortLists;

  res
    .cookie("jwt", newRefreshToken, {
      httpOnly: true,
      // look what be its important
      sameSite: "Lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .json({ roles, accessToken, shortLists })
    .status(200);
  
};

module.exports = { handleRefreshToken };
