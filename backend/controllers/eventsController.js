
const users = require('../db/data/test-data/users')
const {fetchEventById, selectAllEvents, createEvent, signUpToEvent, checkIfSignupExists} = require('../models/eventModel')
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
const {event_id} = req.params
try {
    const event = await fetchEventById(event_id)
res.status(200).send({event})
}
catch(error){
   next(error)
}}


//post new event (admin only)
exports.postEvent = async (req,res,next) => {
    const {title, description, date, location, price, is_paid, img} = req.body
    
     // Check if the user is an admin
     if (!req.user || req.user.role !== 'admin') {
       return res.status(403).json({msg: 'Access denied. Admins only.'})
    }

    // Check for required fields
    if (!title || !description || !date || !location || price === undefined || is_paid === undefined || !img) {
         return res.status(400).json({msg: 'All fields are required.' }); // Custom error for missing fields
    }
    
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

//sign up to an event (users only)

exports.postSignUpToEvent = async (req,res,next) => {
    const eventId = req.params.event_id
    const userId = req.user.userId
try {


    //check that event exists
    await fetchEventById(eventId)
    
    
        // check if user is already signed up to this event
    const existingSignup = await checkIfSignupExists(userId, eventId)
    if(existingSignup.rowCount>0) {
        return res.status(400).json({msg: 'You are already signed up for this event.'})
    }
    
    //insert new signup
    await signUpToEvent(userId, eventId)
    res.status(201).send({msg: `Successfully signed up user ${userId} to event ${eventId}`})

}
catch(error) {
    next(error)
}
}