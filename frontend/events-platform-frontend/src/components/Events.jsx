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
  <section className='events-container' aria-labelledby="events-header">
    <header>
      <h2 id="events-header" className='events-header'>What's On</h2>
    </header>
    <ul className='events'>
      {events.map((event) => (
        <li key={event.event_id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  </section>
);
}

export default Events