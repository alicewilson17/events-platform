import React from 'react'
import {BeatLoader} from "react-spinners"

function Loading() {
  return (
    <div className='loading'><BeatLoader color='#862260' size={20}/>
    <h2>Please bear with us!</h2>
    <p>This site uses a free hosting service, so loading can take some time. Hang in there!</p></div>
  )
}

export default Loading