// const Database = require("better-sqlite3");
// const db = new Database("database.db");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// Create tables if they don't exist
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cost_price REAL NOT NULL,
  selling_price REAL NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  quantity INTEGER,
  total_amount REAL,
  profit REAL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  quantity INTEGER,
  cost_price REAL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id)
);
`);

module.exports = db;