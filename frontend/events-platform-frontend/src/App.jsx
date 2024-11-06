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
import NotFound from './components/NotFound'
import CreateEvent from './components/CreateEvent'
import CreateEventSuccess from './components/CreateEventSuccess'
import UpdateEvent from './components/UpdateEvent'
import UpdateEventSuccess from './components/UpdateEventSuccess'

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
      <Route path = "/events/:event_id/update" element = {<UpdateEvent/>}/>
    <Route path = "/events/:event_id/update/success" element = {<UpdateEventSuccess/>}/>
      <Route path="*" element={<NotFound/>}/>
     </Routes>
     </div>
    </>
  )
}

export default App
