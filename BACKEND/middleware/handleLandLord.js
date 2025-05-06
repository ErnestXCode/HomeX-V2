const handleLandLord = (req, res, next) => {
  try {
    if (!req.user?.isLandlord)
      return res.status(400).json("Not authorized , not a landlord");
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = handleLandLord;
