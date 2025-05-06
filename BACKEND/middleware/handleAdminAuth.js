const handleAdminAuth = (req, res, next) => {
  try {
    if (!req.user?.isAdmin)
      return res.status(400).json("Not authorized , admin side");
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = handleAdminAuth;
