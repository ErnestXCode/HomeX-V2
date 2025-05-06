const jwt = require("jsonwebtoken");

const handleToken = (res, userId) => {
  console.log("token", userId);
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
  return token;
};

module.exports = handleToken;
