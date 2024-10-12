const db = require('../db');
const bcrypt = require('bcrypt')
const format = require('pg-format')

const seedDatabase = async ({eventsData, usersData}) => {
    try {
        //drop tables if they exist
        await db.query('DROP TABLE IF EXISTS events;');
        await db.query('DROP TABLE IF EXISTS users;');

        //create tables
        await db.query(`CREATE TABLE users (
                user_id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL
            );
            `)
  await db.query(`
    CREATE TABLE events (
      event_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        price DECIMAL(10, 2),
        is_paid BOOLEAN NOT NULL DEFAULT FALSE,
        created_by INTEGER REFERENCES users(user_id),
        img VARCHAR(255)
    );
    `)

    const hashedUsers = await Promise.all(usersData.map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return [user.first_name, user.last_name, user.email, hashedPassword, user.role];
    }));

// Seed users
await db.query(format(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES %L;',
  hashedUsers
  ));

  // Seed events
  await db.query(format(
    'INSERT INTO events (title, description, date, location, price, is_paid, created_by, img) VALUES %L;',
    eventsData.map(({ title, description, date, location, price, is_paid, created_by, img }) => 
      [title, description, date, location, price, is_paid, created_by, img])
  ));

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;