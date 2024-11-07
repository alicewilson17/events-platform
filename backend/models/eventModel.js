const db = require('../db/db')



exports.fetchEventById = async(event_id) => {
    const res = await db.query('SELECT * FROM events WHERE event_id = $1', [event_id])
    if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Event not found" });
           }
    return res.rows[0]

}

exports.selectAllEvents = async() => {
    const res = await(db.query(`SELECT * FROM events ORDER BY date asc`))
    return res.rows
}

exports.createEvent= async(newEventData) => {
    const {title, description, date, start_time, end_time, location, price, is_paid, created_by, img} = newEventData
    const res = await db.query(`INSERT INTO events (title, description, date, start_time, end_time, location, price, is_paid, created_by, img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`, [title, description, date, start_time, end_time, location, price, is_paid, created_by, img])
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

exports.cancelSignup = async (user_id, event_id) => {
    const res = await db.query(
      `DELETE FROM signups WHERE user_id = $1 AND event_id = $2 RETURNING *;`,
      [user_id, event_id]
    );
    return res;
  };
  
exports.updateEvent = async (eventId, updatedEventData) => {
    const {title, description, date, start_time, end_time, location, price, is_paid, img} = updatedEventData;

    const res = await db.query(
        `UPDATE events 
         SET title = $1, description = $2, date = $3, start_time = $4, end_time = $5, location = $6, price = $7, is_paid = $8, img = $9 
         WHERE event_id = $10 
         RETURNING *;`,
        [title, description, date, start_time, end_time, location, price, is_paid, img, eventId]
    );

    return res.rows[0];
};


exports.deleteEventById = async (eventId) => {
    const result = await db.query(
        `DELETE FROM events WHERE event_id = $1 RETURNING *;`,
        [eventId]
    );
    return result.rows[0];
};
