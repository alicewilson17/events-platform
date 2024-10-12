import React, { useEffect, useState } from 'react'
import { getEvents } from '../api'




function Home() {
  const [events, setEvents] = useState([])
  useEffect(() => {
      getEvents()
      .then((events) => {
        setEvents(events)
        console.log(events)
      })
    .catch((error) => {
      console.error('error fetching events:', error)
    })
}, [])


  return (
    <div className='home'>

        <div className='hero-section'>
            <div className='hero-text'>
            <h1>Get ahead.</h1>
            <h4>The latest events for women in tech, all in one place.</h4>

            </div>
            <img src="../assets/images/hero-img.jpg" alt="Two women laughing and looking at laptops."/>

        </div>


        <div className='events'>
          <h2>Events</h2>
          {events.map((event)=> { 
          
            return <p key={event.event_id}>{event.title}</p>

          })}

        </div>
        </div>
  )
}

export default Home