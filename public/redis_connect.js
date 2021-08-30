const redis = require('redis')
require('dotenv').config();
module.exports = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})