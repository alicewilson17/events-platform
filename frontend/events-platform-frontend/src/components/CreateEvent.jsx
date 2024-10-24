import React, { useState } from 'react'
import { createEvent } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Loading from './Loading'

function CreateEvent() {
    const {user, isLoggedIn} = useAuth()
    const navigate = useNavigate()
const [newEvent, setNewEvent] = useState({title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    price: "",
    is_paid: false,
    img: ""
})
const [formErrors, setFormErrors] = useState("")
const[isLoading, setIsLoading] = useState(false)

const validateForm = () => {
    const errors = {}
    for (const key in newEvent) {
        const required = ["title", "description", "start_time", "end_time", "date", "location"]
        if (required.includes(key) && (!newEvent[key])) {
            errors[key] = `${key.split("_").join(" ")[0].toUpperCase() + key.split("_").join(" ").slice(1)} is required.`

        }
    }
    if ((newEvent.is_paid) && (!newEvent.price)) {
        errors.price = "As you have specified that this is a paid event, a price is required."
    }
    return errors
}


const handleChange = (event) => {

    // Convert radio input values to boolean
    const newValue = event.target.type === 'radio' ? event.target.value === 'true' : event.target.value;
    setNewEvent((prevData) => {
      return {
        ...prevData,
        [event.target.name]: newValue,
      };
    });
  };


    const handleCreateEvent = async(event) => {
        event.preventDefault()
        const errors = validateForm()

        //set a default cover image if no URL is provided
        const defaultImageURL = "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
        const eventData = {
            ...newEvent,
            img: newEvent.img || defaultImageURL,
            //ensure price is set to 0 if event is free
            price: newEvent.is_paid ? newEvent.price : 0.00
        }
        console.log(eventData)

        try {
            setFormErrors("")
            if(Object.keys(errors).length > 0) {
                setFormErrors(errors)
                return;
            }
            setIsLoading(true)
            const createdEvent = await createEvent(
                eventData.title,
                eventData.description,
                eventData.date,
                eventData.start_time,
                eventData.end_time,
                eventData.location,
                eventData.price,
                eventData.is_paid,
                eventData.img
            );
            console.log("Event created successfully:", createdEvent);
            navigate('/events/createevent/success', {state: {event: createdEvent}})

        }
        catch(error) {
            console.error("Error creating event:", error);
        }
    }

const isAdmin = user && user.role === 'admin'

if(isLoading) {
    return <Loading/>
}
  return (
      <>
      {isAdmin ? (
       <div className='create-event-form'>
        <h1>Create a New Event</h1>
    <form onSubmit={handleCreateEvent}>
        <label>
<p>Event title <span style={{color: 'red'}}>*</span></p>
    <input
          type="text"
          name="title"
    
          value={newEvent.title}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.title && <p style={{color: 'red'}}>{formErrors.title}</p>}
        <label>
        <p>Event description <span style={{color: 'red'}}>*</span></p>
        <textarea
          name="description"

          value={newEvent.description}
          onChange={handleChange}
        ></textarea>
        </label>
        {formErrors.description && <p style={{color: 'red'}}>{formErrors.description}</p>}
        <label>
        <p>Location <span style={{color: 'red'}}>*</span></p>
        <input
          type="text"
          name="location"
         
          value={newEvent.location}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.location && <p style={{color: 'red'}}>{formErrors.location}</p>}
        <label>
        <p>Event date <span style={{color: 'red'}}>*</span></p>
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={newEvent.date}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.date && <p style={{color: 'red'}}>{formErrors.date}</p>}
        <label>
        <p>Start time <span style={{color: 'red'}}>*</span></p>
        <input
          type="time"
          name="start_time"
          placeholder="Start time"
          value={newEvent.start_time}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.start_time && <p style={{color: 'red'}}>{formErrors.start_time}</p>}
        <label>
        <p>End time <span style={{color: 'red'}}>*</span></p>
        <input
          type="time"
          name="end_time"
          placeholder="End time"
          value={newEvent.end_time}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.end_time && <p style={{color: 'red'}}>{formErrors.end_time}</p>}
        
        <label className='radio-label'>
        <input
          type="radio"
          name="is_paid"
          checked={newEvent.is_paid === false}
          value="false"

          onChange={handleChange}
        ></input>This event is free to attend
        </label>
        <label className='radio-label'>
        <input
          type="radio"
          name="is_paid"
          checked={newEvent.is_paid === true}
          value="true"
          onChange={handleChange}
        ></input>This is a paid event
        </label>
        <label>
        <p>Ticket price (£) {newEvent.is_paid && <span style={{color: 'red'}}>*</span>}</p>
        <input type="number" name="price" value = {newEvent.price} onChange={handleChange} min="0.01" step="0.01" max="2500" disabled={newEvent.is_paid ? false : true}  />
        {formErrors.price && <p style={{color: 'red'}}>{formErrors.price}</p>}
        </label>
        <label>
        Cover image URL (optional)
        <input
          type="text"
          name="img"
          placeholder="https://your-image-url-here.jpeg"
          value={newEvent.img}
          onChange={handleChange}
        ></input>
        </label>
        <button type='submit'>Create event</button>
        </form>
        </div>
       ) : (
        <div className='admin-only-message'>
            <h2>Oops! You need to be an admin to view this page.</h2>
        {isLoggedIn ?  <a href="/"><button>Back to home</button></a> : <a href="/auth/login"><button>Log in</button></a>}
       </div>
    )}
    </>
  )
}

export default CreateEvent