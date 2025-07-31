// const mongoose = require('mongoose');
const { Pool } = require("pg");

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 


const pool = new Pool({
    host: "localhost",
    user: process.env.POSTGRESS_NAME,
    database: "authentication_basics",
    password: process.env.POSTGRESS_PASSWORD,
    port: 5432
})

// const conn = process.env.DB_STRING;

// const connection = mongoose.createConnection(conn, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// // Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
// const UserSchema = new mongoose.Schema({
//     username: String,
//     hash: String,
//     salt: String
// });


// const User = connection.model('User', UserSchema);

// // Expose the connection
module.exports = pool;
