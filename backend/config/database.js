const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
   //  database: process.env.DB_NAME,
    database: process.env.DB_NAME_MAIN,

    
 });
 
 // Test the database connection
 pool.getConnection((err, connection) => {
    if (err) {
       console.error('Error connecting to the database:', err);
       return;
    }
    console.log('Connected to the MySQL database');
    connection.release();
 });

module.exports=pool