
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, "../ca.pem")),
    },
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("Database connected successfully");
});

module.exports = connection;
