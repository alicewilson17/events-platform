import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AddToGoogleCalendar from './AddToGoogleCalendar'
import NotFound from './NotFound'

function EventSignUpSuccess() {
    const {user} = useAuth()
    const location = useLocation()
    const [event] = location.state || {}

    if(!event) {
      return <NotFound/>
    }
  return (
  <div className='signup-success-container'>
<div className='signup-success'>
<div className='success-message'>
<h1>See you there, {user.first_name}!</h1>
<img src="../../assets/icons/checkbox.png" alt="purple tick"/>
<h2>You're going to <strong>{event.title}</strong></h2>
</div>
<div className='event-details'>
<h2>Event details</h2>
<p><strong>Title:</strong> {event.title}</p>
<p><strong>Date:</strong> {event.date.split('T')[0].split('-').reverse().join("/")}</p>
<p><strong>Time</strong> {event.start_time[0] === '0' ? event.start_time.slice(1,-3) : event.start_time.slice(0,-3)} - {event.end_time.slice(0,-3)}</p>
<p><strong>Location:</strong> {event.location}</p>
<p><strong>Description:</strong> {event.description}</p>
      <AddToGoogleCalendar title={event.title} date={event.date} start_time={event.start_time} end_time={event.end_time} description={event.description} location={event.location}/>
    </div>

</div>
</div>
  )
}

export default EventSignUpSuccess