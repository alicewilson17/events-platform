const db = require('../db/db')



exports.fetchEventById = async(id) => {
    const res = await db.query('SELECT * FROM events WHERE id = $1', [id])
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
    console.log(created_by)
    const res = await db.query(`INSERT INTO events (title, description, date, location, price, is_paid, created_by, img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`, [title, description, date, location, price, is_paid, created_by, img])
    return res.rows[0]
}