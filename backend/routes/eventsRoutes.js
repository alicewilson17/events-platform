const express = require("express");
const {
  getEventById,
  getAllEvents,
  postEvent,
  postSignUpToEvent,
} = require("../controllers/eventsController");
const { adminOnly, verifyToken } = require("../middleware/authMiddleware");


const router = express.Router();

/**
 * @swagger
 * /api/events/{event_id}:
 *   get:
 *     summary: Returns an event by ID
 *     tags: 
 *       - Events
 *     parameters:
 *       - name: event_id
 *         in: path
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The event data
 *       404:
 *         description: Event not found
 */
router.get("/:event_id", getEventById);

/**
 * @swagger
 * /api/events:
 *  get:
 *    summary: Returns a list of events.
 *    tags:
 *      - Events
 *    responses:
 *      "200":
 *        description: An array of event objects
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: string
 */
router.get("/", getAllEvents);


//sign up to event (users only)

/**
 * @swagger
 * /api/events/{event_id}/signup:
 *   post:
 *     summary: Sign up to an event
 *     tags: 
 *       - Events
 *     parameters:
 *       - name: event_id
 *         in: path
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - event_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               event_id:
 *                 type: integer
 *                 example: 1
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-11-05T10:00:00.000Z"
 *     responses:
 *       201:
 *         description: Event sign up successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event sign up successful"
 *       400:
 *         description: User already signed up to this event
 *       404:
 *         description: Event not found
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Internal server error
 */
router.post('/:event_id/signup', verifyToken, postSignUpToEvent)




//admin-only routes

//create event route

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: 
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - location
 *               - price
 *               - is_paid
 *               - created_by
 *               - img
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Women in tech meetup"
 *               description:
 *                 type: string
 *                 example: "A meetup for women in tech in London"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-11-05T10:00:00.000Z"
 *               location:
 *                 type: string
 *                 example: "London"
 *               price:
 *                 type: string
 *                 example: "0.00"
 *               is_paid:
 *                 type: boolean
 *                 example: false
 *               created_by:
 *                 type: number
 *                 example: 1
 *               img:
 *                 type: string
 *                 example: "https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg"
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event created successfully"
 *       400:
 *         description: Invalid input, or user already exists
 *       500:
 *         description: Internal server error
 */

router.post('/', verifyToken, adminOnly, postEvent)




module.exports = router;
