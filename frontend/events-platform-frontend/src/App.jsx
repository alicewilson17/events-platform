import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Events from './components/Events'
import Home from './components/Home'
import SingleEvent from './components/SingleEvent'
import NavBar from './components/NavBar'
import Account from './components/Account'

function App() {
  
  return (
    <>
    <NavBar/>
     <Routes>
      <Route path = "/" element = {<Home/>} />
      <Route path= "/events" element ={<Events/>} />
      <Route path="/events/:event_id" element ={<SingleEvent/>} />
      <Route path="/account" element = {<Account/>} />

     </Routes>
    </>
  )
}

export default App
