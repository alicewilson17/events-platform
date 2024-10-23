import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LogInForm from './LogInForm'
import { getSignUpsByUser } from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import EventCard from './EventCard'


function Account() {
  const {user, logOut, isLoggedIn} = useAuth()
const [signedUpEvents, setSignedUpEvents] = useState([])
const navigate = useNavigate()

useEffect(() => {
  if(user) {
    const userId = user.user_id
    getSignUpsByUser(userId)
    .then(({signUps}) => {
      setSignedUpEvents(signUps)
    }
    )
    .catch((error) => {
      console.error ('Error fetching signups: ', error)
    })
  }
}, [user])

const handleNavigate = () => {
 navigate('/events/createevent')
}

  return (
    <div className='account'>
      {isLoggedIn ? 
      <div className='dashboard'><h2>Welcome, {user.first_name}</h2>
      {user.role === 'admin' && <div className='created-events'><h2>Your Hosted Events</h2>
      <button onClick={handleNavigate}>Create event</button></div>}
      {signedUpEvents.length === 0 ? <h2>You have no upcoming events.</h2> : <div className='signups'>
        <h3>Your upcoming events</h3>
        <div className='upcoming-events'>
          {signedUpEvents.map(signup => <EventCard key={signup.event_id} event={signup}/>)}

        </div>
        </div>}
      <button onClick={logOut}>Log out</button></div> : <LogInForm/>}
      </div>
    //if user is not logged in, display Auth component
    //if user is logged in, display account details


  )
}

export default Account