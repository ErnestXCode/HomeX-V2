const Redis = require('redis')

const redisClient = Redis.createClient({
  url: "redis://172.22.247.38:6379",
});
 

module.exports = redisClient