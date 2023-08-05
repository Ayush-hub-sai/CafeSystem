const mysql = require('mysql')
require('dotenv').config()

var connection = mysql.createConnection({
    // port: process.env.PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err, result) => {
    if (err) {
        console.log('error');
    } else {
        console.log('connection successfull established');
    }
})

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'ganesh',
//     password: 'Ganesh@111',
//     database: 'harry'
// })

module.exports = connection;