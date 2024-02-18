const { Pool } = require("pg");

const connection = {
  user: "postgres",
  host: "localhost",
  database: "twep",
  password: "",
  port: 5432,
};

const pool = new Pool(connection);

module.exports = pool;
