
const {fetchEventById, selectAllEvents, createEvent} = require('../models/eventModel')
//get all events
exports.getAllEvents = async(req,res,next) => {
    try {
        const events = await selectAllEvents()
        res.status(200).send({events})
    }
    catch(error){
       next(error)
    }
}
//get event by id
exports.getEventById = async (req,res,next) => {
const {id} = req.params
try {
    const event = await fetchEventById(id)
res.status(200).send({event})
}
catch(error){
   next(error)
}}


//sign up to an event (users only)

//post new event (admin only)
exports.postEvent = async (req,res,next) => {
    console.log(req.user, "req user")
    const {title, description, date, location, price, is_paid, img} = req.body
    const created_by = req.user.userId //the id of the logged in user
    try {
       
        const event = await createEvent({title, description, date, location, price, is_paid, created_by, img})
        res.status(201).json({event})
    }
    catch(error) {
        next(error)
    }
}
//update event (admin only)

//delete event (admin only)