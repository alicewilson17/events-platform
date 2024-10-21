import React from 'react'
import {Link} from 'react-router-dom'

function EventCard({event}) {

      const formattedDate = new Date(event.date).toISOString().split('T')[0].split("-").reverse().join("/");
  return (
  
        <div className='event-card'>
              <Link to={`/events/${event.event_id}`}>
        <img src={event.img}/>
        <h3>{event.title}</h3>
              </Link>
        <h4>{formattedDate}</h4>
        <p>{event.start_time.slice(0, -3)} - {event.end_time.slice(0, -3)}</p>
        <p>{event.location}</p>
        <p>{event.is_paid ? 'From £' + event.price : 'Free'}</p>
        </div>
  )
}

export default EventCard