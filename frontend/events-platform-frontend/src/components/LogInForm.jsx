import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'



function LogInForm() {
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [error, setError] = useState("") //api errors
const [formErrors, setFormErrors] = useState("") //errors for form validation
const {logIn} = useAuth()
const navigate = useNavigate()
const location = useLocation()

const from = location.state?.from?.pathname || '/' //if user was directed here, get the original location they came from

const validateForm = () => {
  const errors = {}
  if(!email) {
    errors.email = "Email is required."
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Please enter a valid email address."
  }
  if (!password) {
    errors.password = "Password is required."
  }
  return errors
}


const handleLogIn = async(event) => {
  event.preventDefault() //prevent form reload
  const errors = validateForm() //call validate function to validate the inputs
  if(Object.keys(errors).length > 0) {
    setFormErrors(errors)
    return;
  }
  try {
setError("") //clear any previous errors
await logIn(email, password) // call the context function
navigate(from, {replace: true}) //if login successful, redirect to original location
  }
  catch(error) {
  setError(error.message)
  }
}

  return (
    <div className='login'><h2>Log in</h2>
    {error && <p style={{color: 'red'}}>{error}</p>}
    <form onSubmit={handleLogIn}>
        <input type='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)}></input>
        {formErrors.email && <p style={{color: 'red'}}>{formErrors.email}</p>}
        <input type='password' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}></input>
        {formErrors.password && <p style={{color: 'red'}}>{formErrors.password}</p>}
        <button type="submit">Log in</button>
        </form>
        <p>Don't have an account? <Link to={`/auth/signup`}>Sign up</Link></p></div>
  )
}

export default LogInForm