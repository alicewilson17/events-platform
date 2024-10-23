import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='not-found'><h1>Oops! Page not found.</h1>
    <Link to={'/'}><button>Back to home</button></Link>
    </div>
  )
}

export default NotFound