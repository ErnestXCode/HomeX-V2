const redis = require('redis')
const redisClient = redis.createClient()

const handleCache = async(req, res, next) => {
    const cachedResponse = await redisClient.get('areas', (err, data) => {
        if(err) console.log('no data in redis')
        if(data !== null ){
            console.log('data', data)
        }
    })
    if(cachedResponse) console.log('exists') 
    if(!cachedResponse) console.log('we now have to set data to redis')
    next()
}

module.exports = handleCache
// i need to install client 