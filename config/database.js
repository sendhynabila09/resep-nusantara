const mysql = require('mysql2');
require('dotenv').config();

// Connection pool: seluruh kredensial dibaca dari .env (tidak ada hardcode)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true // kolom DATE dikembalikan sebagai string 'YYYY-MM-DD'
});

// Interface Promise agar bisa memakai async/await
module.exports = pool.promise();
