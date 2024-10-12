import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL
})

export const getEvents = async () => {
    const url = '/events'
   const response = await api.get(url)
   console.log(response.data.events, "response data")
return response.data.events

}