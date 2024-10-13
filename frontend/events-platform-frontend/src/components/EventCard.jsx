import React from 'react'
import {Link} from 'react-router-dom'

function EventCard({event}) {
  return (
  
        <div className='event-card'>
              <Link to={`/events/${event.event_id}`}>
        <img src={event.img}/>
        <h3>{event.title}</h3>
              </Link>
        <h4>{event.date}</h4>
        <p>{event.location}</p>
        <p>{event.is_paid ? 'From £' + event.price : 'Free'}</p>
        </div>
  )
}

export default EventCard