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

exports.CreateEvent= async() => {
    const res = await(db.query(`INSERT INTO events `))
}