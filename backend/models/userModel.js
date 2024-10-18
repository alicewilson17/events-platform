const db = require('../db/db')
const bcrypt = require('bcrypt')

//Get user by email
exports.getUserByEmail = async (email) => {
const res = await db.query('SELECT * FROM users WHERE email = $1;', [email])
return res.rows[0]
}

//Create a new user
exports.createUser = async (first_name, last_name, email, password, role) => {
    const res = await db.query('INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;', 
                [first_name, last_name, email, password, role])
        return res.rows[0]
}

//get signups by user
exports.fetchSignupsByUser = async(user_id) => {
const res = await db.query('SELECT events.event_id, events.title, events.description, events.date, events.location, events.img FROM signups JOIN events ON signups.event_id = events.event_id WHERE signups.user_id = $1;', [user_id])
return res.rows
}