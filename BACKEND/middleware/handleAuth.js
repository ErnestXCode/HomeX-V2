const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const handleAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) return res.status(400).json("Not Authorized, no token");

    const decodedID = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedID)
      return res.status(400).json("Not Authorized, invalid token");

    const authorizedUser = await User.findById(decodedID.userId);
    req.user = authorizedUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = handleAuth;

// some issue
