const express = require('express')
const { getSignUpsByUser, getAdminEvents } = require('../controllers/usersController')
const { verifyToken, adminOnly } = require('../middleware/authMiddleware')
const router = express.Router()

//get all the events a user has signed up to (logged in users only)

/**
 * @swagger
 * /users/{user_id}/signups:
 *   get:
 *     summary: Get signups for a specific user
 *     description: Retrieve all event signups for the logged-in user or for an admin retrieving another user's signups. Only the user or an admin can access this information.
 *     tags:
 *       - Signups
 *     security:
 *       - bearerAuth: []   # JWT token authentication
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user whose signups to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the signups for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signUps:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event_id:
 *                         type: integer
 *                       event_title:
 *                         type: string
 *                       signup_date:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad request, possibly due to invalid parameters.
 *       403:
 *         description: Access denied. The user is not authorized to view the signups.
 *       404:
 *         description: The user or signups were not found.
 *       500:
 *         description: Internal server error.
 */

router.get('/:user_id/signups', verifyToken, getSignUpsByUser)


//ADMIN ONLY: get events created by admin (with signups)

/**
 * @swagger
 * /api/admin/events:
 *   get:
 *     summary: Get all events created by the admin and the number of signups for each event
 *     description: This endpoint allows admins to retrieve all the events they have created. It also returns the number of signups for each event.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of events created by the admin, including the number of signups for each event.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event_id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "How to Thrive as a Woman Developer"
 *                       description:
 *                         type: string
 *                         example: "A motivational talk on how women developers can thrive in the workplace."
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-12-11"
 *                       start_time:
 *                         type: string
 *                         format: time
 *                         example: "10:00:00"
 *                       end_time:
 *                         type: string
 *                         format: time
 *                         example: "11:30:00"
 *                       location:
 *                         type: string
 *                         example: "Online Webinar (UK)"
 *                       price:
 *                         type: number
 *                         example: 0.0
 *                       is_paid:
 *                         type: boolean
 *                         example: false
 *                       created_by:
 *                         type: integer
 *                         example: 1
 *                       img:
 *                         type: string
 *                         example: "https://images.pexels.com/photos/6457519/pexels-photo-6457519.jpeg"
 *                       signup_count:
 *                         type: integer
 *                         example: 25
 *       401:
 *         description: Unauthorized. No token provided or the token has expired.
 *       403:
 *         description: Access denied. Admins only.
 *       404:
 *         description: No events found for the admin.
 *       500:
 *         description: Internal server error.
 */
router.get('/admin/events', verifyToken, adminOnly, getAdminEvents)

module.exports = router