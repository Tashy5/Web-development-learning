const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to your database file
const dbPath = path.resolve(__dirname, 'db', 'gallery.db');

// Connect to SQLite database (it will create the file if it doesn't exist)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

module.exports = db;

// Create Users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Create Images table
db.run(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    caption TEXT,
    price REAL
  )
`);