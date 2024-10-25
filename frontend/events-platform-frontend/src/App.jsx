import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Events from './components/Events'
import Home from './components/Home'
import SingleEvent from './components/SingleEvent'
import NavBar from './components/NavBar'
import Account from './components/Account'
import LogInForm from './components/LogInForm'
import SignUpForm from './components/SignUpForm'
import EventSignUpSuccess from './components/EventSignUpSuccess'
import CreateEvent from './components/CreateEvent'
import CreateEventSuccess from './components/CreateEventSuccess'
import NotFound from './components/NotFound'

function App() {
  
  return (
    <>
    <NavBar/>
    <div className='main-content'>
     <Routes>
      <Route path = "/" element = {<Home/>} />
      <Route path= "/events" element ={<Events/>} />
      <Route path="/events/:event_id" element ={<SingleEvent/>} />
      <Route path="/account" element = {<Account/>} />
      <Route path ="/auth/login" element = {<LogInForm/>}/>
      <Route path = "/auth/signup" element = {<SignUpForm/>}/>
      <Route path = "/events/:event_id/signupsuccess" element = {<EventSignUpSuccess/>}/>
      <Route path = "/events/createevent" element={<CreateEvent/>}/>
      <Route path = "/events/createevent/success" element={<CreateEventSuccess/>}/>
      <Route path="*" element={<NotFound/>}/>
     </Routes>
     </div>
    </>
  )
}

export default App
