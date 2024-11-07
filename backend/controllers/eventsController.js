const {
  fetchEventById,
  selectAllEvents,
  createEvent,
  signUpToEvent,
  checkIfSignupExists,
  updateEvent,
  deleteEventById,
  cancelSignup
} = require("../models/eventModel");
//get all events
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await selectAllEvents();
    res.status(200).send({ events });
  } catch (error) {
    next(error);
  }
};
//get event by id
exports.getEventById = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    const event = await fetchEventById(event_id);
    res.status(200).send({ event });
  } catch (error) {
    next(error);
  }
};

//post new event (admin only)
exports.postEvent = async (req, res, next) => {
  const {
    title,
    description,
    date,
    start_time,
    end_time,
    location,
    price,
    is_paid,
    img,
  } = req.body;

  // Check if the user is an admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }

  // Check for required fields
  if (
    !title ||
    !description ||
    !date ||
    !start_time ||
    !end_time ||
    !location ||
    price === undefined ||
    is_paid === undefined ||
    !img
  ) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  const created_by = req.user.userId; //the id of the logged in user
  try {
    const event = await createEvent({
      title,
      description,
      date,
      start_time,
      end_time,
      location,
      price,
      is_paid,
      created_by,
      img,
    });
    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
};

// Check if user is signed up to an event
exports.checkSignupStatus = async (req, res, next) => {
  const eventId = req.params.event_id;
  const userId = req.user.userId;
  try {
    const existingSignup = await checkIfSignupExists(userId, eventId);
    if (existingSignup.rowCount > 0) {
      return res.status(200).json({ msg: "You are already signed up for this event." });
    } else {
      return res.status(200).json({ msg: "You are not signed up for this event." });
    }
  } catch (error) {
    next(error);
  }
};



//sign up to an event (users only)

exports.postSignUpToEvent = async (req, res, next) => {
  const eventId = req.params.event_id;
  const userId = req.user.userId;
  try {
    //check that event exists
    await fetchEventById(eventId);

    // check if user is already signed up to this event
    const existingSignup = await checkIfSignupExists(userId, eventId);
    if (existingSignup.rowCount > 0) {
      return res
        .status(400)
        .json({ msg: "You are already signed up for this event." });
    }

    //insert new signup
    await signUpToEvent(userId, eventId);
    res
      .status(201)
      .send({
        msg: `Successfully signed up user ${userId} to event ${eventId}`,
      });
  } catch (error) {
    next(error);
  }
};

// Cancel a user's signup for an event
exports.cancelSignup = async (req, res, next) => {
  const eventId = req.params.event_id;
  const userId = req.user.userId;
  try {
    // Remove signup from the database
    const result = await cancelSignup(userId, eventId);
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "No signup found for this event." });
    }
    res.status(200).json({ msg: "Signup canceled successfully." });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  const { event_id } = req.params;
  const {
    title,
    description,
    date,
    start_time,
    end_time,
    location,
    price,
    is_paid,
    img,
  } = req.body;

  // Check if the user is an admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }

  // Check for required fields
  if (
    !title ||
    !description ||
    !date ||
    !start_time ||
    !end_time ||
    !location ||
    price === undefined ||
    is_paid === undefined ||
    !img
  ) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  try {
    // Find the event to verify ownership
    console.log(event_id)
    const event = await fetchEventById(event_id);
    // Check if the logged-in admin is the creator of the event
    if (event.created_by !== req.user.userId) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to update this event." });
    }

    const updatedEvent = await updateEvent(event_id, {
      title,
      description,
      date,
      start_time,
      end_time,
      location,
      price,
      is_paid,
      img,
    });
    res.status(200).json({ updatedEvent });
  } catch (error) {
    next(error);
  }
};

//delete event - admin only
exports.deleteEvent = async (req, res, next) => {
  const { event_id } = req.params;

  try {
    // Check if the user is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    // Fetch event details to verify ownership
    const event = await fetchEventById(event_id);

    // Check if the logged-in admin is the creator of the event
    if (event.created_by !== req.user.userId) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to delete this event." });
    }

    // Delete the event
    const deletedEvent = await deleteEventById(event_id);
    res.status(200).json({ msg: "Event deleted successfully", deletedEvent });
  } catch (error) {
    next(error);
  }
};
