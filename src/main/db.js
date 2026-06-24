const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'shop.db');

const db = new Database(dbPath);

// Pragmas = SQLite performance/safety settings. Just always set these.
db.pragma('journal_mode = WAL'); // better write performance, safer on crash
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      imei TEXT UNIQUE,
      color TEXT,
      storage TEXT,
      condition TEXT,
      purchase_price REAL NOT NULL,
      selling_price REAL,
      status TEXT NOT NULL DEFAULT 'in_stock',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

   
  `);
}

initSchema();

module.exports = db;
