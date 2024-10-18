import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logInUser, signUpUser } from '../api'

const AuthContext = createContext()

//custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext)

//AuthProvider to wrap around the app
export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    //get the user data and token from localStorage when the app starts
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if(storedUser && token) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
}, [])



    //call the api to log in the user and save token + user in localStorage
    const logIn = async(email, password) => {
        try{
            const {token, user} = await logInUser(email, password)
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user)) // need to JSON.stringify as localStorage must always be a string
            setUser(user) //update the user state
            return true
        }
        catch(error) {
            console.error('Login failed:', error)
            return false
        }
    }

    //call the api to sign up the user and store token + user in localStorage
    const signUp = async(first_name, last_name, email, password, role) => {
        try{
            const{token, user} = await signUpUser(first_name, last_name, email, password, role)
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user)) // need to JSON.stringify as localStorage must always be a string
            setUser(user) //update the user state
            return true

        }
        catch(error) {
            console.error('Sign in failed:', error)
            return false
        }
    }

    //log out the user by clearing localStorage and state
    const logOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        navigate('/') //redirect to homepage
    }
    //check later do i need to have back end logic for logging out?

    const value = {
        user,
        logIn,
        signUp,
        logOut,
        isLoggedIn: !!user} //helper to check if user is logged in (in this case, our 'user' state will always be an object or null. !! converts values to their boolean equivalents, so if user is an object, isLoggedIn will be true, and if user is null, isLoggedIn will be false. Makes it easy to conditionally render elements depending on if the user is logged in.

if (loading) return <p>Loading...</p>

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

