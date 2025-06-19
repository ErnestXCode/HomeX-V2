const redisClient = require("../config/redisConfig");

const handleRedis = async (req, res, next) => {
  await redisClient.connect();
  redisClient.set("name", "netstst");
  next();
};

module.exports = handleRedis;
