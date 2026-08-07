export const DB_NAME = "rozkazhy_db";
export const DB_VERSION = 2;

export const UPGRADE_STATEMENTS = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_path TEXT NOT NULL,
        audio_path TEXT,
        tap_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );`,
      `CREATE INDEX IF NOT EXISTS idx_cards_title ON cards(title);`,

      `CREATE TABLE IF NOT EXISTS sentence_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        played_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS sentence_log_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        log_id INTEGER NOT NULL REFERENCES sentence_logs(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        word TEXT NOT NULL,
        card_id INTEGER REFERENCES cards(id) ON DELETE SET NULL
      );`,
      `CREATE INDEX IF NOT EXISTS idx_log_items_log ON sentence_log_items(log_id);`,

      `CREATE TABLE IF NOT EXISTS sequences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        is_favorite INTEGER NOT NULL DEFAULT 0,
        favorite_auto INTEGER NOT NULL DEFAULT 0,
        usage_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        last_used_at INTEGER
      );`,
      `CREATE TABLE IF NOT EXISTS sequence_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sequence_id INTEGER NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE
      );`,
      `CREATE INDEX IF NOT EXISTS idx_sequence_items_seq ON sequence_items(sequence_id);`,
    ],
  },
  {
    toVersion: 2,
    statements: [
      // Nullable — optional word-category tag for the Fitzgerald-key color
      // coding feature. Existing cards keep NULL until a parent tags them.
      `ALTER TABLE cards ADD COLUMN category TEXT;`,
    ],
  },
];
