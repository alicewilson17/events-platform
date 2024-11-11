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
const [isSignupStatusLoading, setIsSignupStatusLoading] = useState(true);

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
} else {
  setIsSignupStatusLoading(false) // if not logged in, no need to check signup status
}
})
.catch((error) => {
console.error(error)
})
}, [event_id, isLoggedIn])

const checkIfUserIsSignedUp = async (eventId) => {
  try {
    const response = await checkSignupStatus(eventId);
    setIsSignedUp(response?.msg === 'You are already signed up for this event.');
  } catch (error) {
    console.error('Error checking signup status: ', error);
  } finally {
    setIsSignupStatusLoading(false);
  }
};

const handleSignUp = async () => {
    if (!isLoggedIn) {
      return navigate('/auth/login');
    }
    try {
      setIsLoading(true);
      await postEventSignUp(user.user_id, event.event_id);
      setIsSignedUp(true);
      navigate(`/events/${event.event_id}/signupsuccess`, { state: [event] });
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data.msg || 'An unexpected error occurred');
    }
  };

  const handleCancelClick = () => {
    setEventIdToCancel(event.event_id);
    setIsPopupVisible(true);
  };

  const handleConfirmCancel = async () => {
    if (!eventIdToCancel) return;
    try {
      await cancelEventSignup(eventIdToCancel);
      setIsSignedUp(false);
    } catch (error) {
      setError("Error: Signup could not be cancelled.");
      console.error('Error canceling signup:', error);
    } finally {
      setIsPopupVisible(false);
      setEventIdToCancel(null);
    }
  };

  const handleCancelClose = () => {
    setIsPopupVisible(false);
    setEventIdToCancel(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className='banner-container'>
        <img src={event.img} alt="Banner image" className="banner-img" />
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
          <h3>{event.is_paid ? `Tickets: £${event.price}` : "This event is free to attend."}</h3>
          {isSignupStatusLoading ? (
      <p style={{marginTop: '1rem'}}>Checking signup status...</p>
    ) : (
      !isLoggedIn ? (
        <button className='book-btn' onClick={handleSignUp}>Sign up to event</button>
      ) : !isSignedUp ? (
        <button className='book-btn' onClick={handleSignUp}>Sign up to event</button>
      ) : (
        <>
          <p style={{ marginTop: '1rem' }}>You are already signed up for this event.</p>
          <button className='book-btn' onClick={handleCancelClick}>Cancel Signup</button>
          {isPopupVisible && (
            <div className="overlay">
              <div className="confirm-delete-popup">
                <p>Are you sure you want to cancel your signup to this event?</p>
                <button onClick={handleConfirmCancel}>Yes</button>
                <button onClick={handleCancelClose}>No</button>
              </div>
            </div>
          )}
        </>
      )
    )}
    {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
  </div>
      </div>
    </>
  );
}

export default SingleEvent;