const db = require('../db');

const seedDatabase = async ({eventsData, usersData}) => {
    try {
        //drop tables if they exist
        await db.query('DROP TABLE IF EXISTS events CASCADE;');
        await db.query('DROP TABLE IF EXISTS users CASCADE;');

        //create tables
        await db.query(`CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL
            );
            `)
  await db.query(`
    CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        price DECIMAL(10, 2),
        is_paid BOOLEAN NOT NULL DEFAULT FALSE,
        created_by INTEGER REFERENCES users(id),
        img VARCHAR(255)
    );
    `)

    //delete existing data

      await db.query('DELETE FROM events;');
      await db.query('DELETE FROM users;');

      //insert new data
        await Promise.all(usersData.map(user => {
            return db.query(`
                INSERT INTO users (first_name, last_name, email, password, role)
                VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
                [user.first_name, user.last_name, user.email, user.password, user.role]);
        }));

        await Promise.all(eventsData.map(event => {
            return db.query(`
                INSERT INTO events (title, description, date, location, price, is_paid, created_by, img)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`, 
                [event.title, event.description, event.date, event.location, event.price, event.is_paid, event.created_by, event.img]);
        }));

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;