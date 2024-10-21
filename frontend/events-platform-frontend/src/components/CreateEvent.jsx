import React, { useState } from 'react'

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
const [formErrors, setFormErrors] = useState({})

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


    const handleCreateEvent = (event) => {
        event.preventDefault()
        console.log(newEvent)
    }

  return (
    <div className='create-event-form'><h2>Add a new event</h2>
    <form onSubmit={handleCreateEvent}>
    <input
          type="text"
          name="title"
          placeholder="Event title"
          value={newEvent.title}
          onChange={handleChange}
        ></input>
        {formErrors.title && <p style={{color: 'red'}}>{formErrors.title}</p>}
        <textarea
          name="description"
          placeholder="Event description"
          value={newEvent.description}
          onChange={handleChange}
        ></textarea>
        {formErrors.description && <p style={{color: 'red'}}>{formErrors.description}</p>}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleChange}
        ></input>
        {formErrors.location && <p style={{color: 'red'}}>{formErrors.location}</p>}
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={newEvent.date}
          onChange={handleChange}
        ></input>
        {formErrors.date && <p style={{color: 'red'}}>{formErrors.date}</p>}
        <input
          type="time"
          name="start_time"
          placeholder="Start time"
          value={newEvent.start_time}
          onChange={handleChange}
        ></input>
        {formErrors.start_time && <p style={{color: 'red'}}>{formErrors.start_time}</p>}
        <input
          type="time"
          name="end_time"
          placeholder="End time"
          value={newEvent.end_time}
          onChange={handleChange}
        ></input>
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
        <input type="number" name="price" min="0.01" step="0.01" max="2500" disabled={newEvent.is_paid ? false : true} placeholder="Ticket price (£)" />
        {formErrors.price && <p style={{color: 'red'}}>{formErrors.price}</p>}
        <input
          type="text"
          name="img"
          placeholder="Cover image URL"
          value={newEvent.img}
          onChange={handleChange}
        ></input>
    {/* sort this out as need to add time too */}
        {formErrors.img && <p style={{color: 'red'}}>{formErrors.img}</p>}


        




        </form>
        <button type='submit'>Create event</button></div>
  )
}

export default CreateEvent