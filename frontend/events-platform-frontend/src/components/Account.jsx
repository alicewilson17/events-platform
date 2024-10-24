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
      <div className='dashboard'>
        <div className='header-and-button'><h1>Hello, {user.first_name}</h1> <button onClick={logOut}>Log out</button></div><hr></hr>
      {user.role === 'admin' && <div className='admin-created-events'><div className='header-and-button'><h2>Events You're Hosting</h2><button onClick={handleNavigate}>Create event</button></div>
      {adminCreatedEvents.length === 0 ? <p>You aren't hosting any upcoming events.</p> : 
      <div className='created-events'>
        {adminCreatedEvents.map(adminEvent => <EventCard key={adminEvent.event_id} event={adminEvent}/>)}
      </div>
      }
      <hr></hr>
      </div>
      }
      <div className='signups'>
        <h2>Events You're Signed Up To</h2>
        {signedUpEvents.length === 0 ? <p>You have no upcoming events.</p> : <div className='upcoming-events'>
          {signedUpEvents.map(signup => <EventCard key={signup.event_id} event={signup}/>)}
        </div>}
        </div>
      </div> : <LogInForm/>}
      </div>
    //if user is not logged in, display Auth component
    //if user is logged in, display account details


  )
}

export default Account