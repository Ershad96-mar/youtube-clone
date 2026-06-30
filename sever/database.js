const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "YOUR_HOST",
    user: "YOUR_USER",
    password: "YOUR_PASSWORD",
    database: "youtube"
});

db.connect(function(err){
    if(err){
        console.log("DB Error:", err);
    }else{
        console.log("MySQL Connected");
    }
});

module.exports = db;