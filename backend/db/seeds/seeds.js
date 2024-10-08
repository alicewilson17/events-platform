const db = require('../db');

const seedDatabase = async ({eventsData, usersData}) => {
    try {
        await db.query('DELETE FROM events;');
        await db.query('DELETE FROM users;');

        await Promise.all(usersData.map(user => {
            return db.query(`
                INSERT INTO users (first_name, last_name, email, password, role)
                VALUES ($1, $2, $3, $4, $5);`, 
                [user.first_name, user.last_name, user.email, user.password, user.role]);
        }));

        await Promise.all(eventsData.map(event => {
            return db.query(`
                INSERT INTO events (title, description, date, location, price, is_paid, created_by, img)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`, 
                [event.title, event.description, event.date, event.location, event.price, event.is_paid, event.created_by, event.img]);
        }));

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;