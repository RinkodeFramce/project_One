const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'datakrat_db',
    password: process.env.DB_PASSWORD || 'Admin321',
    port: process.env.DB_PORT || 5432,
});

module.exports = pool; 