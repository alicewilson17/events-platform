import React, { useEffect, useState } from 'react'
import { getEventById, postEventSignUp, cancelEventSignup, checkSignupStatus } from '../api'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loading from './Loading'


function SingleEvent() {
  const {event_id} = useParams()
const [event, setEvent] = useState({})
const navigate = useNavigate()
const {user, isLoggedIn} = useAuth()
const [error, setError] = useState("")
const [isLoading, setIsLoading] = useState(true)
const [formattedDate, setFormattedDate] = useState("")
const [formattedTimes, setFormattedTimes] = useState("")
const [isSignedUp, setIsSignedUp] = useState(false)
const [isPopupVisible, setIsPopupVisible] = useState(false);
const [eventIdToCancel, setEventIdToCancel] = useState(null);
const [isSignupCancelled, setIsSignupCancelled] = useState(false);
const [isCancelError, setIsCancelError] = useState(false);

useEffect(() => {
  getEventById(event_id)
  .then(({event}) => {
    setEvent(event)
    const date = new Date(event.date).toISOString().split('T')[0].split("-").reverse().join("/");
    setFormattedDate(date)
    const formattedTimeString = `${event.start_time[0] === '0' ? event.start_time.slice(1,-3) : event.start_time.slice(0,-3)} - ${event.end_time.slice(0,-3)}`
    setFormattedTimes(formattedTimeString)
   setIsLoading(false)
 // Check if the user is already signed up to the event
 if (isLoggedIn) {
  checkIfUserIsSignedUp(event.event_id)
}
})
.catch((error) => {
console.error(error)
})
}, [event_id, isLoggedIn])

const checkIfUserIsSignedUp = async (eventId) => {
  try {
    const response = await checkSignupStatus(eventId);  // This returns the response data
    console.log(response, "response!!!!")
    if (response && response.msg === 'You are already signed up for this event.') { 
      console.log('in the if block')
      setIsSignedUp(true);
    }
    else {
      setIsSignedUp(false);}
  } catch (error) {
    console.error('Error checking signup status: ', error)
  }
}

const handleSignUp=async(user, event) => {
  try{
    if(isLoggedIn) {
    const userId = user.user_id
    const eventId = event.event_id
    setIsLoading(true)
    await postEventSignUp(userId, eventId)
    setIsSignedUp(true)  // Update state to show cancel button after signup
     navigate(`/events/${eventId}/signupsuccess`, {state : [event]})
  }
  else {
    navigate('/auth/login')
  }
} catch(error) {
  setIsLoading(false)
  if(error.response && error.response.status === 400)
  {
    setError(error.response.data.msg) //show custom error message
} else {
  console.error('An unexpected error occurred: ', error)
}
}
}

//when user first clicks the cancel event button, display the popup to confirm
const handleCancelClick = (eventId) => {
  setEventIdToCancel(eventId);  // Store the event ID for cancellation
  setIsPopupVisible(true);  // Show the popup
  setIsCancelError(false);
};

//handle confirm cancellation (if the user clicked 'yes')
const handleConfirmCancel = async () => {
  if (eventIdToCancel) {
    try {
      // Call your API to cancel the signup
      await cancelEventSignup(eventIdToCancel);
      setIsSignedUp(false);  // Update UI to reflect the cancellation
      setIsSignupCancelled(true);  // Show cancellation success message
      // Do not close the popup here — let the confirmation be shown
    } catch (error) {
      console.error('Error canceling signup:', error);
      setIsSignedUp(true);  // Keep the user signed up in case of error
      setIsSignupCancelled(false);
      setIsCancelError(true);  // Show error message instead
    }
  }
};

// Handle cancellation (No) click
const handleCancelClose = () => {
  setIsPopupVisible(false);  // hide the popup if they choose No
  setIsCancelError(false);

};

const handleClosePopupAfterCancelSignup = () => {
  setIsSignedUp(false)
  setIsPopupVisible(false);  // hide the popup if they choose No
  setIsCancelError(false);
};


if(isLoading) {
  return <Loading/>
}
  return (
    <>
      <div className='banner-container'>
      <img src={event.img} alt="Banner image" className="banner-img"/>
      </div>
    <div className='single-event-container'>
      <div className='single-event-text'>
              <h1>{event.title}</h1>
      <h3><span>Date:</span> {formattedDate}</h3>
      <h3><span>Time:</span> {formattedTimes}</h3>
      <h3><span>Location:</span> {event.location}</h3>
      <h4>About this event</h4>
      <p>{event.description}</p>
      </div>
      <div className='book-section'>
<h3>{event.is_paid ? `Tickets: £${event.price}`: "This event is free to attend."}</h3>
{!isSignedUp ? (
            <button className='book-btn' onClick={() => handleSignUp(user, event)}>Sign up to event</button>
          ) : (
            <>
              <p>You are already signed up for this event.</p>
              <button className='book-btn' onClick={() => handleCancelClick(event.event_id)}>Cancel Signup</button>

    {/* Conditionally render the popup */}
    {isPopupVisible && (
  <div className="overlay">
    <div className="confirm-delete-popup">
      {isSignupCancelled ? (
        <>
          <p>Cancellation successful. You are no longer attending this event.</p>
          <button onClick={handleCancelClose}>Close</button>
        </>
      ) : isCancelError ? (
        <>
          <p>Error: Signup could not be cancelled.</p>
          <button onClick={handleCancelClose}>Close</button>
        </>
      ) : (
        <>
          <p>Are you sure you want to cancel your signup to this event?</p>
          <button onClick={handleConfirmCancel}>Yes</button>
          <button onClick={handleCancelClose}>No</button>
        </>
      )}
    </div>
  </div>
)}
  
            </>
          )}
      {error && <p style={{color:'red', marginTop:'1rem', textAlign:'center'}}>{error}</p>}
      </div>
      </div>
      </>
  )
}

export default SingleEvent