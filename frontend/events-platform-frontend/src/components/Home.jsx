import React, { useEffect, useState } from 'react'
import Events from './Events'

function Home() {

  return (
    <div className='home'>

        <div className='hero-section'>
            <div className='hero-text'>
            <h1>Get ahead.</h1>
            <h4>The latest events for women in tech, all in one place.</h4>
            
            <a href = "#events">
            <button>Browse Events</button>

            </a>
 

            </div>
            <img src="../assets/images/hero-img.jpg" alt="Two women laughing and looking at laptops."/>
        </div>
        <section id="events">
        <Events/>

        </section>
        </div>
  )
}

export default Home