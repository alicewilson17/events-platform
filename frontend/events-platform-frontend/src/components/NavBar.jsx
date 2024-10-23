import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="navbar">
            <div>
                <Link to={"/"}  className="nav-title"><h2>there she codes</h2></Link>
            </div>
            <div className="navbar-items">
            <Link className="nav-link" to={"/events"}>Find Events</Link>
            <Link className="nav-link" to={"/events/createevent"}>Create Event</Link>
            <Link className="nav-link" to={"/account"}>Account</Link>
            </div>
      




    </nav>
  )
}

export default NavBar