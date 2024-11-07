import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LogInForm from "./LogInForm";
import { getCreatedEvents, getSignUpsByUser, deleteEvent } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import EventCard from "./EventCard";
import Loading from "./Loading";

function Account() {
  const { user, logOut, isLoggedIn } = useAuth();
  const [signedUpEvents, setSignedUpEvents] = useState([]);
  const [adminCreatedEvents, setAdminCreatedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const userId = user.user_id;
      getSignUpsByUser(userId)
        .then(({ signUps }) => {
          setSignedUpEvents(signUps);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching signups: ", error);
        });

      if (user.role === "admin") {
        getCreatedEvents(userId)
          .then(({ adminEvents }) => {
            setAdminCreatedEvents(adminEvents);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching admin created events:", error);
          });
      }
    }
  }, [user]);

  const handleNavCreateEvent = () => {
    navigate("/events/createevent");
  };
  const handleNavUpdateEvent = (event) => {
    const eventId = event.event_id;
    navigate(`/events/${eventId}/update`, { state: { event } });
  };

  const handleDeleteClick = (event) => {
    setIsDeleteError(false);
    setShowConfirmDelete(true);
    setEventToDelete(event); // Set the selected event for deletion
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEvent(eventToDelete.event_id);
      setDeleted(true); // Mark as deleted to update the popup content
      setAdminCreatedEvents(
        adminCreatedEvents.filter(
          (event) => event.event_id !== eventToDelete.event_id
        ))
        setSignedUpEvents(
          signedUpEvents.filter(
            (event) => event.event_id !== eventToDelete.event_id
          )); // Update UI to remove deleted event
      setEventToDelete(null);
    } catch (error) {
      setDeleted(false)
      setIsDeleteError(true);
      console.error("Failed to delete event:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setEventToDelete(null);
  };

  const handleClosePopupAfterDelete = () => {
    setDeleted(false);
    setShowConfirmDelete(false)
    setIsDeleteError(false);
  };

  if (!isLoggedIn) {
    return <LogInForm />;
  }
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="account">
      <div className="dashboard">
        <div className="header-and-button">
          <h1>Hello, {user.first_name}</h1>{" "}
          <button onClick={logOut}>Log out</button>
        </div>
        <hr></hr>
        {user.role === "admin" && (
          <div className="admin-created-events">
            <div className="header-and-button">
              <h2>Events You're Hosting</h2>
              <button onClick={handleNavCreateEvent}>Create event</button>
            </div>
            {adminCreatedEvents.length === 0 ? (
              <p className="no-events-message">
                You aren't hosting any upcoming events.
              </p>
            ) : (
              <div className="created-events">
                {adminCreatedEvents.map((adminEvent) => (
                  <div key={adminEvent.event_id}>
                    <EventCard event={adminEvent} />
                    <div className="attendees-and-buttons">
                      <p style={{ fontWeight: "500" }}>
                        {adminEvent.signup_count} attending
                      </p>
                      <div className="edit-delete-buttons">
                        <img
                          className="edit-button"
                          onClick={() => handleNavUpdateEvent(adminEvent)}
                          src="../../assets/icons/edit.png"
                          alt="edit icon"
                        />
                        <img
                          className="delete-button"
                          onClick={() => handleDeleteClick(adminEvent)}
                          src="../../assets/icons/delete.png"
                          alt="delete icon"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <hr></hr>
          </div>
        )}
        <div className="signups">
          <h2>Events You're Signed Up To</h2>
          {signedUpEvents.length === 0 ? (
            <p className="no-events-message">You have no upcoming events.</p>
          ) : (
            <div className="upcoming-events">
              {signedUpEvents.map((signup) => (
                <EventCard key={signup.event_id} event={signup} />
              ))}
            </div>
          )}
        </div>
      </div>
      {showConfirmDelete && (
        <div className="overlay" onClick={handleCancelDelete}></div>
      )}
      {showConfirmDelete && (
        <div className="confirm-delete-popup">
          {deleted ? (
            <>
              <p>Event deleted.</p>
              <button onClick={handleClosePopupAfterDelete}>Close</button>
            </>
          ) : ( isDeleteError ? 
            (<>
              <p>Error: Event could not be deleted.</p>
              <button onClick={handleClosePopupAfterDelete}>Close</button>
            </> )
          : (
            <>
              <p>Are you sure you want to delete this event?</p>
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </>
          ))
          }
        </div>
      )}
    </div>
  );
}

export default Account;
