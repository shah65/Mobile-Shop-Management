const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'shop.db');
console.log('📁 Database path:', dbPath);

const db = new Database(dbPath);

// Pragmas = SQLite performance/safety settings
db.pragma('journal_mode = WAL');
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
      paid_amount REAL DEFAULT 0,
      remaining_due REAL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'in_stock',
      customer_id TEXT,
      return_price REAL,
      return_deduction REAL,
      return_reason TEXT,
      returned_at TEXT,              -- ✅ FIXED: was 'returnet_at'
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      cnic TEXT,
      address TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

// Try to add missing columns if table already exists
function migrateSchema() {
  try {
    const columns = db.prepare("PRAGMA table_info(devices)").all();
    const columnNames = columns.map(c => c.name);

    // Check and add missing columns
    const columnsToAdd = [
      { name: 'customer_id', type: 'TEXT' },
      { name: 'paid_amount', type: 'REAL DEFAULT 0' },
      { name: 'remaining_due', type: 'REAL DEFAULT 0' },
      { name: 'return_price', type: 'REAL' },
      { name: 'return_deduction', type: 'REAL' },
      { name: 'return_reason', type: 'TEXT' },
      { name: 'returned_at', type: 'TEXT' },  // ✅ FIXED: was 'returnet_at'
    ];

    columnsToAdd.forEach((col) => {
      if (!columnNames.includes(col.name)) {
        db.exec(`ALTER TABLE devices ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✅ Added ${col.name} column`);
      }
    });
  } catch (error) {
    console.log('ℹ️ Migration info:', error.message);
  }
}

initSchema();
migrateSchema();

module.exports = db;