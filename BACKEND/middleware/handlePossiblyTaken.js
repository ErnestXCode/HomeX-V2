const House = require("../models/houseModel")
const cron = require('node-cron')

const handlePossiblyTaken = async () => {
    const houses = await House.find()
    if (houses) console.log('kichwa')
}

