import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function EventSignUpSuccess() {
    const {user} = useAuth()
    const location = useLocation()
    const [event] = location.state
    console.log(event.title)
  return (
    <div>
        <h2>See you there, {user.first_name}!</h2>
      <h3>You're going to {event.title}</h3>
      <h4>Event details:</h4>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
    </div>
  )
}

export default EventSignUpSuccess