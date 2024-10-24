import React from 'react'
import {Link} from 'react-router-dom'

function EventCard({event}) {

      const formattedDate = new Date(event.date).toISOString().split('T')[0].split("-").reverse().join("/");
  return (
  
        <div className='event-card'>
              <Link to={`/events/${event.event_id}`}>
        <img src={event.img} alt={`Thumbnail image for ${event.title}`}/>
        <h3>{event.title}</h3>
              </Link>
        <p><span>{formattedDate}</span> {event.start_time[0] === '0' ? event.start_time.slice(1,-3) : event.start_time.slice(0,-3)} - {event.end_time.slice(0,-3)}</p>
        <p>{event.location}</p>
        <p>{event.is_paid ? 'From £' + event.price : 'Free'}</p>
        </div>
  )
}

export default EventCard