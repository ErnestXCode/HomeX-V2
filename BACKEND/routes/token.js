const express = require('express')
const createToken = require('../controllers/tokenController')

const router = express.Router()

router.route('/token').get(createToken)

module.exports = router