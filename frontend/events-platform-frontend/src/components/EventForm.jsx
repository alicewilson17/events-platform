// import React, { useState, useEffect} from 'react'
// import { createEvent, updateEvent } from '../api'
// import { useAuth } from '../contexts/AuthContext'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { BeatLoader } from 'react-spinners'

// function EventForm() {
//   const { state } = useLocation(); // get event data from previous page
//   const { event = null, isUpdate = false } = state || {};
//   const {user} = useAuth()

//   const [eventData, setEventData] = useState({
//       title: "",
//       description: "",
//       date: "",
//       start_time: "",
//       end_time: "",
//       location: "",
//       price: "",
//       is_paid: false,
//       img: "",
//       ...event // Prepopulate if event data exists ie we're updating an event
//   });
  
//   const [formErrors, setFormErrors] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (event) {
//         setEventData({
//             ...event,
//             date: event.date ? new Date(event.date).toISOString().split('T')[0] : "", // Format the date
//         });
//     }
//  }, [event]);

// const validateForm = () => {
//     const errors = {}
//     for (const key in eventData) {
//         const required = ["title", "description", "start_time", "end_time", "date", "location"]
//         if (required.includes(key) && (!eventData[key])) {
//             errors[key] = `${key.split("_").join(" ")[0].toUpperCase() + key.split("_").join(" ").slice(1)} is required.`

//         }
//     }
//     if ((eventData.is_paid) && (!eventData.price)) {
//         errors.price = "Price is required for paid events."
//     }
//     return errors
// }


// const handleChange = (event) => {

//     // Convert radio input values to boolean
//     const newValue = event.target.type === 'radio' ? event.target.value === 'true' : event.target.value;
//     setEventData((prevData) => {
//       return {
//         ...prevData,
//         [event.target.name]: newValue,
//       };
//     });
//   };


//     const handleSubmit = async(event) => {
//         event.preventDefault()
//         const errors = validateForm()

//         //set a default cover image if no URL is provided
//         const defaultImageURL = "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
//         const eventDataToSubmit = {
//             ...eventData,
//             img: eventData.img || defaultImageURL,
//             //ensure price is set to 0 if event is free
//             price: eventData.is_paid ? eventData.price : 0.00
//         }


//         try {
//             setFormErrors("")
//             if(Object.keys(errors).length > 0) {
//                 setFormErrors(errors)
//                 return;
//             }
//             setIsLoading(true)
//             const eventId = eventDataToSubmit.event_id
//             console.log(eventId)
//             const event = isUpdate ? await updateEvent(eventId, eventDataToSubmit) : await createEvent(eventDataToSubmit); // Calls either create or update
//             console.log(`${isUpdate ? "Updated" : "Created"} event successfully:`, event);
//             setIsLoading(false)
//             navigate('/events/eventform/success', {state: {event: eventDataToSubmit, isUpdate: isUpdate}})

//         }
//         catch(error) {
//             setIsLoading(false)
//             console.error("Error creating event:", error);
//         }
//     }

// const isAdmin = user && user.role === 'admin'

//   return (
//       <>
//       {isAdmin ? (
//        <div className='create-event-form'>
//         <h1>{isUpdate ? "Update Event" : "Create a New Event"}</h1>
//     <form onSubmit={handleSubmit}>
//         <label>
// <p>Event title <span style={{color: 'red'}}>*</span></p>
//     <input
//           type="text"
//           name="title"
    
//           value={eventData.title}
//           onChange={handleChange}
//         ></input>
//         </label>
//         {formErrors.title && <p style={{color: 'red'}}>{formErrors.title}</p>}
//         <label>
//         <p>Event description <span style={{color: 'red'}}>*</span></p>
//         <textarea
//           name="description"

//           value={eventData.description}
//           onChange={handleChange}
//         ></textarea>
//         </label>
//         {formErrors.description && <p style={{color: 'red'}}>{formErrors.description}</p>}
//         <label>
//         <p>Location <span style={{color: 'red'}}>*</span></p>
//         <input
//           type="text"
//           name="location"
         
//           value={eventData.location}
//           onChange={handleChange}
//         ></input>
//         </label>
//         {formErrors.location && <p style={{color: 'red'}}>{formErrors.location}</p>}
//         <label>
//         <p>Event date <span style={{color: 'red'}}>*</span></p>
//         <input
//           type="date"
//           name="date"
//           placeholder="Date"
//           value={eventData.date}
//           onChange={handleChange}
//         ></input>
//         </label>
//         {formErrors.date && <p style={{color: 'red'}}>{formErrors.date}</p>}
//         <label>
//         <p>Start time <span style={{color: 'red'}}>*</span></p>
//         <input
//           type="time"
//           name="start_time"
//           placeholder="Start time"
//           value={eventData.start_time}
//           onChange={handleChange}
//         ></input>
//         </label>
//         {formErrors.start_time && <p style={{color: 'red'}}>{formErrors.start_time}</p>}
//         <label>
//         <p>End time <span style={{color: 'red'}}>*</span></p>
//         <input
//           type="time"
//           name="end_time"
//           placeholder="End time"
//           value={eventData.end_time}
//           onChange={handleChange}
//         ></input>
//         </label>
//         {formErrors.end_time && <p style={{color: 'red'}}>{formErrors.end_time}</p>}
        
//         <label className='radio-label'>
//         <input
//           type="radio"
//           name="is_paid"
//           checked={eventData.is_paid === false}
//           value="false"

//           onChange={handleChange}
//         ></input>This event is free to attend
//         </label>
//         <label className='radio-label'>
//         <input
//           type="radio"
//           name="is_paid"
//           checked={eventData.is_paid === true}
//           value="true"
//           onChange={handleChange}
//         ></input>This is a paid event
//         </label>
//         <label>
//         <p>Ticket price (£) {eventData.is_paid && <span style={{color: 'red'}}>*</span>}</p>
//         <input type="number" name="price" value = {eventData.price} onChange={handleChange} min="0.01" step="0.01" max="2500" disabled={eventData.is_paid ? false : true}  />
//         {formErrors.price && <p style={{color: 'red'}}>{formErrors.price}</p>}
//         </label>
//         <label>
//         Cover image URL (optional)
//         <input
//           type="text"
//           name="img"
//           placeholder="https://your-image-url-here.jpeg"
//           value={eventData.img}
//           onChange={handleChange}
//         ></input>
//         </label>
//         <button type='submit' disabled={isLoading}> {isLoading ? (
//     <BeatLoader size={10} color="#ffffff" />
//   ) : (
//     isUpdate ? "Update Event" : "Create Event"
//   )}
//         </button>
//         </form>
//         </div>
//        ) : (
//         <div className='admin-only-message'>
//             <h2>Oops! You need to be an admin to view this page.</h2>
//         {isLoggedIn ?  <a href="/"><button>Back to home</button></a> : <a href="/auth/login"><button>Log in</button></a>}
//        </div>
//     )}
//     </>
//   )
// }

// export default EventForm