import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AddToGoogleCalendar from './AddToGoogleCalendar'

function EventSignUpSuccess() {
    const {user} = useAuth()
    const location = useLocation()
    const [event] = location.state
  return (
    <div>
        <h2>See you there, {user.first_name}!</h2>
      <h3>You're going to {event.title}</h3>
      <h4>Event details:</h4>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <AddToGoogleCalendar title={event.title} date={event.date} start_time={event.start_time} end_time={event.end_time} description={event.description} location={event.location}/>
    </div>
  )
}

export default EventSignUpSuccess