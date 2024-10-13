import React, { useEffect, useState } from 'react'
import { getEventById } from '../api'
import { useParams } from 'react-router-dom'

function SingleEvent() {
  const {event_id} = useParams()
const [event, setEvent] = useState({})

useEffect(() => {
  getEventById(event_id)
  .then(({event}) => {
    setEvent(event)
  })
  .catch((error) => {
    console.error(error)
  })
}, [event_id])


  return (
    <div className='single-event-container'>
      <img src={event.img}/>
      <div className='single-event-text'>
      <h2>{event.title}</h2>
      <h3>{event.date}</h3>
      <h3>{event.location}</h3>
      <p>{event.description}</p>
      <button className='book-btn'>Sign up to event</button>
      
      </div>
      </div>
  )
}

export default SingleEvent