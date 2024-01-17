const { Pool } = require('pg');

const connection = {
    user: 'postgres',
    host: 'localhost',
    database: 'twep',
    password: 'postgres',
    port: 5433,
};

const pool = new Pool(connection);

module.exports = pool;
