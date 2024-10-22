import React from 'react'

function AddToGoogleCalendar({title, date, start_time, end_time, description, location}) {


//format date and times for google calendar - should be in format YYYYMMDDTHHmmssZ
const formatDateForCal = (date, time) => {
const formattedDate= date.split("T")[0].replace(/-/g, "")
const dateTime = `${formattedDate}T${time.replace(/:/g, "")}Z`
return dateTime
}

const formattedStartTime = formatDateForCal(date, start_time)
const formattedEndTime = formatDateForCal(date, end_time)

const googleCalURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedStartTime}/${formattedEndTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`

  return (
    <a href = {googleCalURL} target="_blank" rel="noopener noreferrer">
        <button>Add to Google Calendar</button>
    </a>
  )
}

export default AddToGoogleCalendar