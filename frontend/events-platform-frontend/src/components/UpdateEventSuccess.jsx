import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NotFound from "./NotFound";

function UpdateEventSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};
  console.log(event.updatedEvent);

  if (!event) {
    return <NotFound />;
  }
  return (
    <div className="create-event-success-container">
      <div className="create-event-success">
        <div className="success-message">
          <h1>Event updated successfully!</h1>
          <img src="/assets/icons/checkbox.png" alt="purple tick" />
        </div>
        <div className="event-details">
          <h2>Event details</h2>
          <p>
            <strong>Title:</strong> {event.updatedEvent.title}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {event.updatedEvent.date
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}
          </p>
          <p>
            <strong>Time</strong>{" "}
            {event.updatedEvent.start_time[0] === "0"
              ? event.updatedEvent.start_time.slice(1, -3)
              : event.updatedEvent.start_time.slice(0, -3)}{" "}
            - {event.updatedEvent.end_time.slice(0, -3)}
          </p>
          <p>
            <strong>Location:</strong> {event.updatedEvent.location}
          </p>
          <p>
            <strong>Price: </strong>{" "}
            {event.updatedEvent.price > 0
              ? `£${event.updatedEvent.price}`
              : "Free"}
          </p>
          <p>
            <strong>Description:</strong> {event.updatedEvent.description}
          </p>
          <Link to={`/events/${event.updatedEvent.event_id}`}>
            <button>View event</button>
          </Link>
        </div>
        <Link className="manage-events-button-container" to={`/account`}>
          <button>Manage Events</button>
        </Link>
      </div>
    </div>
  );
}

export default UpdateEventSuccess;
