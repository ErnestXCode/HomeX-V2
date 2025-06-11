const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const handleAuth = async (req, res, next) => {
  try {

    const token = req.headers?.authorization.split(' ')[1] || req.headers?.Authorization.split(' ')[1]
    if (!token) return res.status(400).json("Not Authorized, no token");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res.status(400).json("Not Authorized, invalid token");

    const authorizedUser = await User.findOne({email : decoded.email}); 
    if(!authorizedUser) return res.sendStatus(404)
    req.user = authorizedUser._doc; 
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = handleAuth;

// some issue
