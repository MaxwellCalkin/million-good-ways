const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbFile =
  process.env.DATABASE_FILE || path.join(__dirname, 'data', 'asi-forum.db');
const dbDir = path.dirname(dbFile);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbFile);

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT,
    content_markdown TEXT,
    author TEXT DEFAULT 'Anonymous Dreamer',
    media_url TEXT,
    color_palette TEXT,
    mood TEXT,
    tags TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT DEFAULT 'Appreciative Visitor',
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );
`);

const updateTimestampTrigger = `
  CREATE TRIGGER IF NOT EXISTS posts_updated_at
  AFTER UPDATE ON posts
  FOR EACH ROW
  BEGIN
    UPDATE posts SET updated_at = datetime('now') WHERE id = NEW.id;
  END;
`;

db.exec(updateTimestampTrigger);

module.exports = { db };
