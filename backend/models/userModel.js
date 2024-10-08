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