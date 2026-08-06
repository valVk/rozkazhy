import type { SQLiteDBConnection } from "@capacitor-community/sqlite";
import type { SentenceLogEntry } from "../types/card";

const MAX_LOGS = 100;

export async function addSentenceLog(
  db: SQLiteDBConnection,
  words: { word: string; cardId: number }[],
): Promise<void> {
  const playedAt = Date.now();
  const logRes = await db.run(
    `INSERT INTO sentence_logs (played_at) VALUES (?);`,
    [playedAt],
  );
  const logId = logRes.changes?.lastId;
  if (logId == null) return;

  for (let i = 0; i < words.length; i++) {
    await db.run(
      `INSERT INTO sentence_log_items (log_id, position, word, card_id) VALUES (?, ?, ?, ?);`,
      [logId, i, words[i].word, words[i].cardId],
    );
  }

  await db.run(
    `DELETE FROM sentence_logs WHERE id NOT IN (
       SELECT id FROM sentence_logs ORDER BY played_at DESC LIMIT ?
     );`,
    [MAX_LOGS],
  );
}

export async function getRecentLogs(
  db: SQLiteDBConnection,
  limit = 20,
): Promise<SentenceLogEntry[]> {
  const logsRes = await db.query(
    `SELECT id, played_at FROM sentence_logs ORDER BY played_at DESC LIMIT ?;`,
    [limit],
  );
  const logRows =
    (logsRes.values as { id: number; played_at: number }[] | undefined) ?? [];
  if (logRows.length === 0) return [];

  const ids = logRows.map((r) => r.id);
  const placeholders = ids.map(() => "?").join(",");
  const itemsRes = await db.query(
    `SELECT log_id, word FROM sentence_log_items WHERE log_id IN (${placeholders}) ORDER BY log_id, position ASC;`,
    ids,
  );
  const itemRows =
    (itemsRes.values as { log_id: number; word: string }[] | undefined) ?? [];

  return logRows.map((row) => ({
    id: row.id,
    playedAt: row.played_at,
    words: itemRows.filter((i) => i.log_id === row.id).map((i) => i.word),
  }));
}
