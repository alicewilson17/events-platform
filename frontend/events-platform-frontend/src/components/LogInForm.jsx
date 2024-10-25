import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import { BeatLoader } from 'react-spinners'



function LogInForm() {
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [errorFromAPI, setErrorFromAPI] = useState("") //api errors
const [formErrors, setFormErrors] = useState("") //errors for form validation
const [isLoading, setIsLoading] = useState(false)
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
  event.preventDefault() 
  const errors = validateForm() 
  try {
    setFormErrors("")
    setErrorFromAPI("") //clear any previous errors
    if(Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return;
    }
setIsLoading(true)
 await logIn(email, password) 
 setIsLoading(false)
 navigate(from, {replace: true}) //if login successful, redirect to original location
  }
  catch(error) {
    setIsLoading(false)
    const errorMessage = error.response?.data?.message || 
    error.message || 
    "Something went wrong";
setErrorFromAPI(errorMessage);
  }
}

  return (
    <div className='login-page'>
    <img src="https://images.pexels.com/photos/850360/pexels-photo-850360.jpeg" alt="Pink flowers on a table with a laptop and phone."/>
   
    <div className='login'><h1>Welcome back</h1>
    <h2>Please log in to continue</h2>

    <form onSubmit={handleLogIn}>
        <input type='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)}></input>
        {formErrors.email && <p style={{color: 'red'}}>{formErrors.email}</p>}
        <input type='password' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}></input>
        {formErrors.password && <p style={{color: 'red'}}>{formErrors.password}</p>}
        <button type="submit" disabled={isLoading}>{isLoading ? <BeatLoader size={10} color="#ffffff" /> : "Log in"}</button>
        </form>
        { <p style={{color: 'red'}}>{errorFromAPI}</p>}
        <p>Don't have an account? <Link to={`/auth/signup`}>Sign up</Link></p></div>
        </div>
  )
}

export default LogInForm