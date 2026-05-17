const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'nutriguide.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      age INTEGER,
      weight REAL,
      height REAL,
      gender TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      token TEXT
    );

    CREATE TABLE IF NOT EXISTS health_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      bmi REAL,
      bmr REAL,
      hydration_goal INTEGER DEFAULT 2500,
      hydration_current INTEGER DEFAULT 0,
      body_fat_percentage REAL,
      tdee REAL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      water INTEGER DEFAULT 0,
      exercise INTEGER DEFAULT 0,
      healthy_food INTEGER DEFAULT 0,
      sleep INTEGER DEFAULT 0,
      supplements INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS calculator_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      label TEXT NOT NULL,
      date TEXT NOT NULL,
      inputs TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ Tabelas do banco de dados inicializadas.');
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
    console.log('🔒 Banco de dados fechado.');
  }
}

module.exports = { getDb, closeDb };
