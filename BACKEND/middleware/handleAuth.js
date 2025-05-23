const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const handleAuth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization.split(' ')[1]
    if (!token) return res.status(400).json("Not Authorized, no token");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res.status(400).json("Not Authorized, invalid token");

    const authorizedUser = await User.findOne({name : decoded.username}); //bad because names are not unique, make it better with ids
    req.user = authorizedUser._doc; //because its ot an index i think
    console.log(authorizedUser)
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = handleAuth;

// some issue
