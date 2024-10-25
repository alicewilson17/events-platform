import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
const [isActive, setIsActive] = useState(false)

const toggleActiveClass = () => {
  setIsActive(!isActive)
}

 //clean up function to remove the active class
 const removeActive = () => {
  setIsActive(false)
}
return (
      <nav className="navbar">
        <Link to={"/"}  className="nav-title"><h2>there she codes</h2></Link>
        <ul className={`navMenu ${isActive ? 'active' : ''}`}>
        <li onClick={removeActive}>
          <Link className="nav-link" to={"/"}>Home</Link>
          </li>
          <li onClick={removeActive}>
          <Link className="nav-link" to={"/events"}>Find Events</Link>
          </li>
          <li onClick={removeActive}>
          <Link className="nav-link" to={"/events/createevent"}>Create Event</Link>
          </li>
          <li onClick={removeActive}>
          <Link className="nav-link" to={"/account"}>Account</Link>
          </li>
        </ul>
        <div className={`hamburger ${isActive ? 'active' : ''}`}  onClick={toggleActiveClass}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </nav>
);
}

export default NavBar