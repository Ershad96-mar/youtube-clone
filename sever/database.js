const Database = require("better-sqlite3");

const db = new Database("youtube.db");

console.log("Database Connected");

module.exports = db;

db.prepare(`
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
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user'
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS comments(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    videoId TEXT,
    userId INTEGER,
    username TEXT,
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

