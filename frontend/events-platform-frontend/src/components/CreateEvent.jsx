import React, { useState } from 'react'
import { createEvent } from '../api'

function CreateEvent() {
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
            img: newEvent.img || defaultImageURL
        }
        console.log(eventData)

        try {
            setFormErrors("")
            if(Object.keys(errors).length > 0) {
                setFormErrors(errors)
                return;
              }
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

        }
        catch(error) {
            console.error("Error creating event:", error);
        }
    }

  return (
    <div className='create-event-form'><h2>Add a new event</h2>
    <form onSubmit={handleCreateEvent}>
        <label>
Event title <span style={{color: 'red'}}>*</span>
    <input
          type="text"
          name="title"
    
          value={newEvent.title}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.title && <p style={{color: 'red'}}>{formErrors.title}</p>}
        <label>
        Event description <span style={{color: 'red'}}>*</span>
        <textarea
          name="description"

          value={newEvent.description}
          onChange={handleChange}
        ></textarea>
        </label>
        {formErrors.description && <p style={{color: 'red'}}>{formErrors.description}</p>}
        <label>
        Location <span style={{color: 'red'}}>*</span>
        <input
          type="text"
          name="location"
         
          value={newEvent.location}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.location && <p style={{color: 'red'}}>{formErrors.location}</p>}
        <label>
        Event date <span style={{color: 'red'}}>*</span>
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
        Start time <span style={{color: 'red'}}>*</span>
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
        End time <span style={{color: 'red'}}>*</span>
        <input
          type="time"
          name="end_time"
          placeholder="End time"
          value={newEvent.end_time}
          onChange={handleChange}
        ></input>
        </label>
        {formErrors.end_time && <p style={{color: 'red'}}>{formErrors.end_time}</p>}
        
        <label>
        <input
          type="radio"
          name="is_paid"
          checked={newEvent.is_paid === false}
          value="false"

          onChange={handleChange}
        ></input>This event is free to attend
        </label>
        <label>
        <input
          type="radio"
          name="is_paid"
          checked={newEvent.is_paid === true}
          value="true"
          onChange={handleChange}
        ></input>This is a paid event
        </label>
        <label>
        Ticket price (£) {newEvent.is_paid && <span style={{color: 'red'}}>*</span>}
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
  )
}

export default CreateEvent