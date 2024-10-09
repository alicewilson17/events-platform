const express = require('express')
const {getEventById, getAllEvents} = require('../controllers/eventsController')
const { adminOnly } = require('../middleware/authMiddleware')


const router = express.Router()

router.get('/:id', getEventById)
router.get('/', getAllEvents)


//admin-only routes
router.post('/', adminOnly, createEvent)

module.exports = router