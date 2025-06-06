const cron = require('node-cron')

const handleHouseStatus = (req, res) => {
try {

    const d = new Date() 
    const min = d.getMinutes()
    const hour = d.getHours() 
    const date = d.getDate()
cron.schedule(`* * * * *`, () => {

    })
} catch (error) {
    console.log('error with nodecron', err)
    throw new Error('cron job shidaa')
}
}