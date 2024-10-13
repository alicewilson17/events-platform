import React from 'react'
import { getEvents } from '../api'
import EventCard from './EventCard'
import { useState, useEffect } from 'react'

function Events() {
  const [events, setEvents] = useState([])
  useEffect(() => {
      getEvents()
      .then((events) => {
        setEvents(events)
      })
    .catch((error) => {
      console.error('error fetching events:', error)
    })
}, [])


  return (
    <div className='events'>
         {events.map((event)=> { 
          
          return <EventCard key={event.event_id} event={event}/>

        })}
    </div>
  )
}

export default Events