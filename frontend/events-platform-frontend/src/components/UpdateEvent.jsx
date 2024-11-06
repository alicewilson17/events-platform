import React, { useEffect, useState } from 'react'
import { updateEvent } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'

function UpdateEvent() {
    const {state} = useLocation()
    const { event } = state || {};
    const {user, isLoggedIn} = useAuth()
    const navigate = useNavigate()
const [updatedEvent, setUpdatedEvent] = useState({title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    price: "",
    is_paid: false,
    img: "",
    ...event
})
const [formErrors, setFormErrors] = useState("")
const[isLoading, setIsLoading] = useState(false)

useEffect(() => {
    if (event) {
        setUpdatedEvent({
            ...event,
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : "", // Format the date
        });
    }
 }, [event]);

const validateForm = () => {
    const errors = {}
    for (const key in updatedEvent) {
        const required = ["title", "description", "start_time", "end_time", "date", "location"]
        if (required.includes(key) && (!updatedEvent[key])) {
            errors[key] = `${key.split("_").join(" ")[0].toUpperCase() + key.split("_").join(" ").slice(1)} is required.`

        }
    }
    if ((updatedEvent.is_paid) && (!updatedEvent.price)) {
        errors.price = "As you have specified that this is a paid event, a price is required."
    }
    return errors
}


const handleChange = (event) => {

    // Convert radio input values to boolean
    const newValue = event.target.type === 'radio' ? event.target.value === 'true' : event.target.value;
    setUpdatedEvent((prevData) => {
      return {
        ...prevData,
        [event.target.name]: newValue,
      };
    });
  };


    const handleUpdateEvent = async(event) => {
        event.preventDefault()
        const errors = validateForm()

        //set a default cover image if no URL is provided
        const defaultImageURL = "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
        const eventData = {
            ...updatedEvent,
            img: updatedEvent.img || defaultImageURL,
            //ensure price is set to 0 if event is free
            price: updatedEvent.is_paid ? updatedEvent.price : 0.00
        }


        try {
            setFormErrors("")
            if(Object.keys(errors).length > 0) {
                setFormErrors(errors)
                return;
            }
            setIsLoading(true)
            const updatedEvent = await updateEvent(eventData.event_id,
               eventData
            );
            setIsLoading(false)
            console.log("Event updated successfully:", updatedEvent);
            navigate('/events/updateevent/success', {state: {event: updatedEvent}})

        }
        catch(error) {
            setIsLoading(false)
            console.error("Error creating event:", error);
        }
    }

const isAdmin = user && user.role === 'admin'

  return (
      <>
      {isAdmin ? (
       <div className='create-event-form'>
        <h1>Update Event</h1>
    <form onSubmit={handleUpdateEvent}>
        <label>
<p>Event title <span style={{color: 'red'}}>*</span></p>
    <input
          type="text"
          name="title"
    
          value={updatedEvent.title}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.title && <p style={{color: 'red'}}>{formErrors.title}</p>}
        <label>
        <p>Event description <span style={{color: 'red'}}>*</span></p>
        <textarea
          name="description"

          value={updatedEvent.description}
          onChange={handleChange}
        ></textarea>
        </label>
        {formErrors.description && <p style={{color: 'red'}}>{formErrors.description}</p>}
        <label>
        <p>Location <span style={{color: 'red'}}>*</span></p>
        <input
          type="text"
          name="location"
         
          value={updatedEvent.location}
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
          value={updatedEvent.date}
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
          value={updatedEvent.start_time}
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
          value={updatedEvent.end_time}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.end_time && <p style={{color: 'red'}}>{formErrors.end_time}</p>}
        
        <label className='radio-label'>
        <input
          type="radio"
          name="is_paid"
          checked={updatedEvent.is_paid === false}
          value="false"

          onChange={handleChange}
        ></input>This event is free to attend
        </label>
        <label className='radio-label'>
        <input
          type="radio"
          name="is_paid"
          checked={updatedEvent.is_paid === true}
          value="true"
          onChange={handleChange}
        ></input>This is a paid event
        </label>
        <label>
        <p>Ticket price (£) {updatedEvent.is_paid && <span style={{color: 'red'}}>*</span>}</p>
        <input type="number" name="price" value = {updatedEvent.price} onChange={handleChange} min="0.01" step="0.01" max="2500" disabled={updatedEvent.is_paid ? false : true}  />
        {formErrors.price && <p style={{color: 'red'}}>{formErrors.price}</p>}
        </label>
        <label>
        Cover image URL (optional)
        <input
          type="text"
          name="img"
          placeholder="https://your-image-url-here.jpeg"
          value={updatedEvent.img}
          onChange={handleChange}
        ></input>
        </label>
        <button type='submit' disabled={isLoading}>{isLoading ? <BeatLoader size={10} color="#ffffff" /> : "Update event"}</button>
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

export default UpdateEvent