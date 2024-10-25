import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import NotFound from './NotFound'

function CreateEventSuccess() {
    const location = useLocation()
    const navigate = useNavigate()
    const {event} = location.state || {}

 if(!event) {
    return <NotFound/>
    }
  return (
    <div className='create-event-success-container'>
        <div className='create-event-success'>
        <div className='success-message'>
        <h1>Event created successfully!</h1>
        <img src="../../assets/icons/checkbox.png" alt="purple tick"/>
        </div>
        <div className='event-details'>
        <h2>Event details</h2>
        <p><strong>Title:</strong> {event.event.title}</p>
        <p><strong>Date:</strong> {event.event.date.split('T')[0].split('-').reverse().join("/")}</p>
        <p><strong>Time</strong> {event.event.start_time[0] === '0' ? event.event.start_time.slice(1,-3) : event.event.start_time.slice(0,-3)} - {event.event.end_time.slice(0,-3)}</p>
        <p><strong>Location:</strong> {event.event.location}</p>
        <p><strong>Price: </strong> £{event.event.price > 0 ? event.event.price : "Free"}</p>
        <p><strong>Description:</strong> {event.event.description}</p>
       <Link to={`/events/${event.event.event_id}`}><button>View event</button></Link>
        </div>
       <Link to={`/events/createevent`}></Link> <button className='create-another-event'>Create another event</button>
        </div> 
        </div>
  )
}

export default CreateEventSuccess