const db = require('../db');
const devData = require('../data/development-data/index')
const seedDatabase = require('./seeds')

const runSeed = async () => {
    try {
        await db.connect(); // Ensure database connection
        await seedDatabase(devData); // Seed users and events
        await db.end(); // Close the connection
    } catch (error) {
        console.error('Error running seed:', error);
    }
};

runSeed();
