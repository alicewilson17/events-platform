const express = require("express");
const {
  getEventById,
  getAllEvents,
  postEvent,
  postSignUpToEvent,
  updateEvent,
  deleteEvent,
  checkSignupStatus,
  cancelSignup
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
 *               - start_time
 *               - end_time
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
 *                 format: date
 *                 example: "2024-11-05"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "14:00:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "16:00:00"
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


//update event

/**
 * @swagger
 * /{event_id}:
 *   put:
 *     summary: Update an existing event
 *     description: Allows an admin to update the details of a specific event. Only the admin who created the event can make updates.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the event
 *       - in: body
 *         name: event
 *         description: The updated event data
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - description
 *             - date
 *             - start_time
 *             - end_time
 *             - location
 *             - price
 *             - is_paid
 *             - img
 *           properties:
 *             title:
 *               type: string
 *               description: Title of the event
 *             description:
 *               type: string
 *               description: Detailed description of the event
 *             date:
 *               type: string
 *               format: date
 *               description: Date of the event (YYYY-MM-DD)
 *             start_time:
 *               type: string
 *               format: time
 *               description: Start time of the event (HH:MM)
 *             end_time:
 *               type: string
 *               format: time
 *               description: End time of the event (HH:MM)
 *             location:
 *               type: string
 *               description: Location where the event will take place
 *             price:
 *               type: number
 *               description: Price of the event ticket
 *             is_paid:
 *               type: boolean
 *               description: Indicates if the event requires payment
 *             img:
 *               type: string
 *               description: URL of the event image
 *     responses:
 *       200:
 *         description: Successfully updated the event
 *         schema:
 *           type: object
 *           properties:
 *             updatedEvent:
 *               $ref: '#/definitions/Event'
 *       400:
 *         description: Missing or invalid input fields
 *       403:
 *         description: Access denied. Only the creating admin can update this event
 *       500:
 *         description: Server error
 */


router.put('/:event_id', verifyToken, adminOnly, updateEvent);

//delete event

/**
 * @swagger
 * /{event_id}:
 *   delete:
 *     summary: Delete an event
 *     description: Allows an admin to delete a specific event. Only the admin who created the event can delete it.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the event to be deleted
 *     responses:
 *       200:
 *         description: Successfully deleted the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Confirmation message that the event was deleted
 *                 deletedEvent:
 *                   type: object
 *                   description: The details of the deleted event
 *                   $ref: '#/definitions/Event'
 *       403:
 *         description: Access denied. Only the creating admin can delete this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

router.delete('/:event_id', verifyToken, adminOnly, deleteEvent);

//check if user is signed up for an event
/**
 * @swagger
 * /{event_id}/signupstatus:
 *   get:
 *     summary: Check user signup status for an event
 *     description: Checks whether the logged-in user is signed up for a specific event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the event to check signup status for
 *     responses:
 *       200:
 *         description: Signup status message indicating if the user is signed up or not
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating whether the user is signed up for the event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */


router.get('/:event_id/signupstatus', verifyToken, checkSignupStatus);

//cancel signup for an event

/**
 * @swagger
 * /{event_id}/cancel:
 *   delete:
 *     summary: Cancel user signup for an event
 *     description: Cancels the signup for a specific event for the logged-in user.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the event to cancel signup for
 *     responses:
 *       200:
 *         description: Signup successfully canceled for the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating that the signup was canceled successfully
 *       404:
 *         description: No signup found for the event or event not found
 *       500:
 *         description: Server error
 */

router.delete('/:event_id/cancel', verifyToken, cancelSignup);

module.exports = router;
