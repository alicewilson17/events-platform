import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SignUpForm() {
  const [newUserData, setNewUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "attendee",
  });
  const [formErrors, setFormErrors] = useState({})
  const [error, setError] = useState('') //api errors
  const {signUp} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/' //if user was directed here, get the original location they came from


  const validateForm = () => {
    const errors = {}
if(!newUserData.first_name) {
    errors.first_name = 'First name is required.'
}
if(!newUserData.last_name) {
    errors.last_name = 'Last name is required.'
}
if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!newUserData.password || newUserData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
return errors
  }

  const handleChange = (event) => {
    setNewUserData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSignUpUser = async(event) => {
    event.preventDefault()
    const errors=validateForm()
    if(Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return;
    }
    console.log(newUserData);
    try{
setError('') // clear any existing api errors
await signUp(newUserData.first_name, newUserData.last_name, newUserData.email, newUserData.password, newUserData.role)
console.log('Sign up successful: ', newUserData)
navigate(from, {replace: true}) //if login successful, redirect to original location   
}
    catch(error) {
        setError(error.msg)
    }
  };

  return (
    <div className='signup-page'>
    <img src="https://images.pexels.com/photos/850360/pexels-photo-850360.jpeg" alt="Pink flowers on a table with a laptop and phone."/>
    <div className="signupform">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUpUser}>
        <input
          type="text"
          name="first_name"
          placeholder="First name"
          value={newUserData.first_name}
          onChange={handleChange}
        ></input>
        {formErrors.first_name && <p style={{color: 'red'}}>{formErrors.first_name}</p>}
         <input
          type="text"
          name="last_name"
          placeholder="Last name"
          value={newUserData.last_name}
          onChange={handleChange}
        ></input>
         {formErrors.last_name && <p style={{color: 'red'}}>{formErrors.last_name}</p>}
         <input
          type="email"
          name="email"
          placeholder="Email address"
          value={newUserData.email}
          onChange={handleChange}
        ></input>
         {formErrors.email && <p style={{color: 'red'}}>{formErrors.email}</p>}
         <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUserData.password}
          onChange={handleChange}
        ></input>
         {formErrors.password && <p style={{color: 'red'}}>{formErrors.password}</p>}
        <div className="user-role">
           <label>
            <input
          type="radio"
          name="role"
          value = "attendee"
          checked={newUserData.role === 'attendee'}
          onChange={handleChange}
        ></input> I'm an individual looking to attend events
            </label>
            <label>
         <input
          type="radio"
          name="role"
          value = "admin"
          checked={newUserData.role === 'admin'}
          onChange={handleChange}
        ></input> I'm a business looking to post events
            </label>
        </div>
        <button type="submit">Sign up</button>
      </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <p>Already have an an account? <Link to={`/auth/login`}>Log in</Link></p>
    </div>
    </div>
  );
}

export default SignUpForm;
