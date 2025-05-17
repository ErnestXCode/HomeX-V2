const express = require('express') 
const getImageByFilename = require('../controllers/imageController')
const router =express.Router( )

router.route('/images/:filename').get(getImageByFilename) 
router.route('/images').get((req, res) => {
    res.json({message:  'this shit is so confusing'}).status(200)
})

module.exports = router