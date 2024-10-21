const express = require('express')
const { getSignUpsByUser } = require('../controllers/usersController')
const { verifyToken } = require('../middleware/authMiddleware')
const router = express.Router()

//get all the events a user has signed up to (logged in users only)

/**
 * @swagger
 * /api/users/{user_id}/signups:
 *   get:
 *     summary: Returns a list of the events the user is signed up to.
 *     tags: 
 *       - Users
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The signups data
 *       403:
 *         description: Access denied (user not authenticated)
 */

router.get('/:user_id/signups', verifyToken, getSignUpsByUser)


module.exports = router