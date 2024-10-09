
const {fetchEventById, selectAllEvents} = require('../models/eventModel')
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

//update event (admin only)

//delete event (admin only)