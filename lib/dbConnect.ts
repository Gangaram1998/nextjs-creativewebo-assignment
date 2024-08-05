const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'slide'
});

db.connect((err: any) => {
    if (err) {
        console.log("Error while connecting to the database", err)
    }
    else {
        console.log("connected to mySQL Database.")
    }
})

module.exports = db;