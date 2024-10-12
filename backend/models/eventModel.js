const db = require('../db/db')



exports.fetchEventById = async(event_id) => {
    const res = await db.query('SELECT * FROM events WHERE event_id = $1', [event_id])
    if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Event not found" });
           }
    return res.rows[0]

}

exports.selectAllEvents = async() => {
    const res = await(db.query(`SELECT * FROM events`))
    return res.rows
}

exports.createEvent= async(newEventData) => {
    const {title, description, date, location, price, is_paid, created_by, img} = newEventData
    const res = await db.query(`INSERT INTO events (title, description, date, location, price, is_paid, created_by, img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`, [title, description, date, location, price, is_paid, created_by, img])
    return res.rows[0]
}

exports.checkIfSignupExists = async(user_id, event_id) => {
    const res = await db.query(`SELECT * FROM signups WHERE user_id = $1 AND event_id = $2;`, [user_id, event_id])
    return res
}

exports.signUpToEvent = async(user_id, event_id) => {
    const res = await db.query(`INSERT INTO signups (user_id, event_id) VALUES ($1, $2);`, [user_id, event_id])
    return res.rows[0]
}