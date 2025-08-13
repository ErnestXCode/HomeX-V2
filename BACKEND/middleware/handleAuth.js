const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const handleAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json("Not Authorized, no token");

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json("Not Authorized, invalid or expired token");
    }

    const authorizedUser = await User.findOne({ email: decoded.email });
    if (!authorizedUser) return res.status(404).json("User not found");

    req.user = authorizedUser._doc
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json("Internal server error");
  }
};

module.exports = handleAuth;
