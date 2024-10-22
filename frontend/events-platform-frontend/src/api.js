import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL
})

export const getEvents = async () => {
    const url = '/events'
   const response = await api.get(url)
return response.data.events

}
export const getEventById = async (event_id) => {
const url = `/events/${event_id}`
const response = await api.get(url)
return response.data
}

//sign up to event - logged in users only
export const postEventSignUp = async (user_id, event_id) => {
    const token = localStorage.getItem('token')
    const url = `/events/${event_id}/signup`
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await api.post(url, {}, config)
    return response.data
}

//log in
export const logInUser = async(email, password) => {
    try {
        const url = `/auth/login`
    const postBody = {email: email, password: password}
    const response = await api.post(url, postBody)
    if (response.status !== 200) {
        throw new Error(response.data.message || "Invalid credentials");
      }
  
      // Return data if login is successful
      return response.data;
    } catch (error) {
      // If Axios encounters a 400 or 401 error, it will go to this catch block
      throw error;
    }
}
    //response data has token and user properties on it

    //sign up new user
export const signUpUser = async(first_name, last_name, email, password, role) => {
    const url = `/auth/signup`
    const postBody = {first_name, last_name, email, password, role}
    const response = await api.post(url, postBody)
    return response.data
    //response data has token and user properties on it
}

export const getSignUpsByUser = async(user_id) => {
    const url = `/users/${user_id}/signups`
    const token = localStorage.getItem('token')
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await api.get(url, config)
    return response.data
}

//create new event (admins only)
export const createEvent = async(title, description, date, start_time, end_time, location, price, is_paid, img) => {
    const url = `/events`
    const postBody = {title, description, date, start_time, end_time, location, price, is_paid, img}
    const token = localStorage.getItem('token')
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await api.post(url, postBody, config)
    console.log(response.data)
    return response.data
}