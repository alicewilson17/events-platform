import React, { useEffect, useState } from 'react'
import { getEventById, postEventSignUp } from '../api'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'


function SingleEvent() {
  const {event_id} = useParams()
const [event, setEvent] = useState({})
const navigate = useNavigate()
const {user, isLoggedIn} = useAuth()
const [error, setError] = useState("")
const [formattedDate, setFormattedDate] = useState("")
const [formattedTimes, setFormattedTimes] = useState("")

useEffect(() => {
  getEventById(event_id)
  .then(({event}) => {
    setEvent(event)
    const date = new Date(event.date).toISOString().split('T')[0].split("-").reverse().join("/");
    setFormattedDate(date)
    const formattedTimeString = `${event.start_time[0] === '0' ? event.start_time.slice(1,-3) : event.start_time.slice(0,-3)} - ${event.end_time.slice(0,-3)}`
    setFormattedTimes(formattedTimeString)
   
  })
  .catch((error) => {
    console.error(error)
  })
}, [event_id])

const handleSignUp=async(user, event) => {
  try{
    if(isLoggedIn) {
    console.log(user, event)
    const userId = user.user_id
    const eventId = event.event_id
    console.log(userId, eventId)
    await postEventSignUp(userId, eventId)
     navigate(`/events/${eventId}/signupsuccess`, {state : [event]})
  }
  else {
    navigate('/auth/login')
  }
} catch(error) {
  if(error.response && error.response.status === 400)
  {
    setError(error.response.data.msg) //show custom error message
} else {
  console.error('An unexpected error occurred: ', error)
}
}
}

  return (
    <>
      <div className='banner-container'>
      <img src={event.img} alt="Banner image" class="banner-img"/>
      </div>
    <div className='single-event-container'>
      <div className='single-event-text'>
              <h1>{event.title}</h1>
      <h3>{formattedDate}</h3>
      <h3>{formattedTimes}</h3>
      <h3>{event.location}</h3>
      <p>{event.description}</p>
      </div>
      <div className='book-section'>
<h3>{event.isPaid ? `£${event.price}`: "This event is free to attend."}</h3>
      <button className='book-btn' onClick={() => handleSignUp(user, event)}>Sign up to event</button>
      {error && <p>{error}</p>}
      </div>
      </div>
      </>
  )
}

export default SingleEvent