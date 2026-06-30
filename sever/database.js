const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("youtube.db", function(error){

    if(error){

        console.log(error.message);

    }else{

        console.log("Database Connected");

    }

});

module.exports = db;

db.serialize(function(){

    db.run(`

        CREATE TABLE IF NOT EXISTS videos(

            id TEXT PRIMARY KEY,

            title TEXT,

            channel TEXT,

            subscribers TEXT,

            views TEXT,

            date TEXT,

            description TEXT,

            image TEXT,

            avatar TEXT,

            duration TEXT,

            category TEXT,

            type TEXT,

            src TEXT

        )

    `);

});