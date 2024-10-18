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

useEffect(() => {
  getEventById(event_id)
  .then(({event}) => {
    setEvent(event)
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
    <div className='single-event-container'>
      <img src={event.img}/>
      <div className='single-event-text'>
      <h2>{event.title}</h2>
      <h3>{event.date}</h3>
      <h3>{event.location}</h3>
      <p>{event.description}</p>
      <button className='book-btn' onClick={() => handleSignUp(user, event)}>Sign up to event</button>
      {error && <p>{error}</p>}
      </div>
      </div>
  )
}

export default SingleEvent