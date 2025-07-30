const express = require('express')
const createToken = require('../controllers/tokenController')
const handleAuth = require('../middleware/handleAuth')

const router = express.Router()

router.route('/stkpush').post(handleAuth,createToken)

module.exports = router