const express = require('express')
const {signUp, logIn} = require('../controllers/authController')

const router = express.Router()

//Sign up route
router.post('/signup', signUp)

//login route
router.post('/login', logIn)

module.exports = router