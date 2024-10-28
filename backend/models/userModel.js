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
const res = await db.query('SELECT events.event_id, events.title, events.description, events.date, events.start_time, events.end_time, events.location, events.img FROM signups JOIN events ON signups.event_id = events.event_id WHERE signups.user_id = $1 ORDER BY events.date asc;', [user_id])
return res.rows
}

//ADMIN ONLY: get created events
exports.fetchAdminEventsWithSignups = async(user_id) => {
        const res = await db.query (`
                SELECT events.*, COUNT(signups.id) AS signup_count
                FROM events LEFT JOIN signups ON events.event_id = signups.event_id
                WHERE events.created_by = $1
                GROUP BY events.event_id ORDER BY events.date asc;`, [user_id])
        return res.rows
}