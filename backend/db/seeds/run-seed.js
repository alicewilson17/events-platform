const db = require('../db');
const devData = require('../data/development-data/index')
const seedDatabase = require('./seeds')

const runSeed = () => {
    return seedDatabase(devData).then(() => db.end());
  };
  
  runSeed();
