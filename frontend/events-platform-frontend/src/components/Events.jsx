import React from 'react'
import { getEvents } from '../api'
import EventCard from './EventCard'
import { useState, useEffect } from 'react'
import Loading from './Loading'

function Events() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
      getEvents()
      .then((events) => {
        setEvents(events)
        setIsLoading(false)
      })
    .catch((error) => {
      console.error('error fetching events:', error)
    })
}, [])

if(isLoading) {
  return <Loading/>
}
  return (
    <div className='events'>
         {events.map((event)=> { 
          
          return <EventCard key={event.event_id} event={event}/>

        })}
    </div>
  )
}

export default Events