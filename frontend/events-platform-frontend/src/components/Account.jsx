import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LogInForm from './LogInForm'
import { getCreatedEvents, getSignUpsByUser } from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import EventCard from './EventCard'
import Loading from './Loading'


function Account() {
  const {user, logOut, isLoggedIn} = useAuth()
const [signedUpEvents, setSignedUpEvents] = useState([])
const [adminCreatedEvents, setAdminCreatedEvents] = useState([])
const [isLoading, setIsLoading] = useState(true)
const navigate = useNavigate()

useEffect(() => {
  if(user) {
    const userId = user.user_id
    getSignUpsByUser(userId)
    .then(({signUps}) => {
      setSignedUpEvents(signUps)
      setIsLoading(false)
    }
    )
    .catch((error) => {
      console.error ('Error fetching signups: ', error)
    })

    if(user.role === 'admin') {
      getCreatedEvents(userId)
        .then(({adminEvents}) => {
         setAdminCreatedEvents(adminEvents)
         setIsLoading(false)
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
if (!isLoggedIn) {
  return <LogInForm/>
}
if(isLoading) {
  return <Loading/>
}
  return (
    <div className='account'>
      <div className='dashboard'>
        <div className='header-and-button'><h1>Hello, {user.first_name}</h1> <button onClick={logOut}>Log out</button></div><hr></hr>
      {user.role === 'admin' && <div className='admin-created-events'><div className='header-and-button'><h2>Events You're Hosting</h2><button onClick={handleNavigate}>Create event</button></div>
      {adminCreatedEvents.length === 0 ? <p className="no-events-message">You aren't hosting any upcoming events.</p> : 
      <div className='created-events' >
        {adminCreatedEvents.map(adminEvent => <div key={adminEvent.event_id}><EventCard  event={adminEvent}/><p style={{fontWeight:'500'}}>{adminEvent.signup_count} attending</p></div>)}
      </div>
      }
      <hr></hr>
      </div>
      }
      <div className='signups'>
        <h2>Events You're Signed Up To</h2>
        {signedUpEvents.length === 0 ? <p className="no-events-message">You have no upcoming events.</p> : <div className='upcoming-events'>
          {signedUpEvents.map(signup => <EventCard key={signup.event_id} event={signup}/>)}
        </div>}
        </div>
      </div>
      </div>

  )
}

export default Account