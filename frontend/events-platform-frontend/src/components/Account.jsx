import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LogInForm from './LogInForm'
import { getCreatedEvents, getSignUpsByUser } from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import EventCard from './EventCard'


function Account() {
  const {user, logOut, isLoggedIn} = useAuth()
const [signedUpEvents, setSignedUpEvents] = useState([])
const [adminCreatedEvents, setAdminCreatedEvents] = useState([])
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

    if(user.role === 'admin') {
      getCreatedEvents(userId)
        .then(({adminEvents}) => {
         setAdminCreatedEvents(adminEvents)
        })
       .catch((error) => {
         console.error('Error fetching admin created events:', error)
        })
  
  }
  }
}, [user])

const handleNavigate = () => {
 navigate('/events/createevent')
}

  return (
    <div className='account'>
      {isLoggedIn ? 
      <div className='dashboard'><h1>Hello, {user.first_name}</h1>
      {user.role === 'admin' && <div className='admin-created-events'><h2>Your Hosted Events</h2>
      <div className='created-events'>

        {adminCreatedEvents.map(adminEvent => <EventCard key={adminEvent.event_id} event={adminEvent}/>)}
      <button onClick={handleNavigate}>Create event</button></div></div>}
      {signedUpEvents.length === 0 ? <p>You have no upcoming events.</p> : <div className='signups'>
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