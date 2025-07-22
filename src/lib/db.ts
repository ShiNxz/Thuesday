import Database from 'better-sqlite3';

const dbFile = process.env.DATABASE_URL || 'monday_clone.db';

const db = new Database(dbFile);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
);
CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  user_id INTEGER
);
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER,
  text TEXT,
  status TEXT
);
`);

export default db;
