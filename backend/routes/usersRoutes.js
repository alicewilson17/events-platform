const express = require('express')
const { getSignUpsByUser } = require('../controllers/usersController')
const { verifyToken } = require('../middleware/authMiddleware')
const router = express.Router()

//get all the events a user has signed up to (logged in users only)
router.get('/:user_id/signups', verifyToken, getSignUpsByUser)
//do the swagger comments and tests for this endpoint

module.exports = router