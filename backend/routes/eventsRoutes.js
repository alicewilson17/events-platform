const express = require("express");
const {
  getEventById,
  getAllEvents,
  postEvent,
} = require("../controllers/eventsController");
const { adminOnly, verifyToken } = require("../middleware/authMiddleware");


const router = express.Router();

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Returns an event by ID
 *     tags: 
 *       - Events
 *     parameters:
 *       - name: id
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
router.get("/:id", getEventById);

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

//admin-only routes
router.post('/', verifyToken, adminOnly, postEvent)

module.exports = router;
