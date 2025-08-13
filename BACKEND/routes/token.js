const express = require('express')
const createToken = require('../controllers/tokenController')
const handleAuth = require('../middleware/handleAuth')
const initiateC2B = require('../controllers/C2BController')

const router = express.Router()

router.route('/initiate').post(handleAuth, initiateC2B)

module.exports = router