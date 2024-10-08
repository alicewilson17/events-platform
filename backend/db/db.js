const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
//This sets the `ENV` variable to the value of `NODE_ENV` from the environment. If `NODE_ENV` is not set, it defaults to `'development'`.

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});
//This loads environment variables from a specific `.env` file based on the current environment. The path is constructed using the current directory (`__dirname`).

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool();
