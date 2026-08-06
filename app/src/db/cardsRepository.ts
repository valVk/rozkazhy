import type { SQLiteDBConnection } from "@capacitor-community/sqlite";
import type { Card } from "../types/card";

interface CardRow {
  id: number;
  title: string;
  image_path: string;
  audio_path: string | null;
  tap_count: number;
  created_at: number;
  updated_at: number;
}

function rowToCard(row: CardRow): Card {
  return {
    id: row.id,
    title: row.title,
    imagePath: row.image_path,
    audioPath: row.audio_path,
    tapCount: row.tap_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllCards(db: SQLiteDBConnection): Promise<Card[]> {
  const res = await db.query("SELECT * FROM cards ORDER BY created_at ASC;");
  return (res.values as CardRow[] | undefined)?.map(rowToCard) ?? [];
}

export async function insertCard(
  db: SQLiteDBConnection,
  data: { title: string; imagePath: string; audioPath: string | null },
): Promise<number> {
  const now = Date.now();
  const res = await db.run(
    `INSERT INTO cards (title, image_path, audio_path, tap_count, created_at, updated_at)
     VALUES (?, ?, ?, 0, ?, ?);`,
    [data.title, data.imagePath, data.audioPath, now, now],
  );
  return res.changes?.lastId ?? -1;
}

export async function updateCardMeta(
  db: SQLiteDBConnection,
  id: number,
  data: { title: string },
): Promise<void> {
  await db.run(`UPDATE cards SET title = ?, updated_at = ? WHERE id = ?;`, [
    data.title,
    Date.now(),
    id,
  ]);
}

export async function updateCardImage(
  db: SQLiteDBConnection,
  id: number,
  imagePath: string,
): Promise<void> {
  await db.run(
    `UPDATE cards SET image_path = ?, updated_at = ? WHERE id = ?;`,
    [imagePath, Date.now(), id],
  );
}

export async function updateCardAudio(
  db: SQLiteDBConnection,
  id: number,
  audioPath: string | null,
): Promise<void> {
  await db.run(
    `UPDATE cards SET audio_path = ?, updated_at = ? WHERE id = ?;`,
    [audioPath, Date.now(), id],
  );
}

export async function incrementTapCount(
  db: SQLiteDBConnection,
  id: number,
): Promise<void> {
  await db.run(`UPDATE cards SET tap_count = tap_count + 1 WHERE id = ?;`, [
    id,
  ]);
}

export async function deleteCard(
  db: SQLiteDBConnection,
  id: number,
): Promise<void> {
  await db.run(`DELETE FROM cards WHERE id = ?;`, [id]);
}

export async function getCardById(
  db: SQLiteDBConnection,
  id: number,
): Promise<Card | null> {
  const res = await db.query("SELECT * FROM cards WHERE id = ?;", [id]);
  const row = (res.values as CardRow[] | undefined)?.[0];
  return row ? rowToCard(row) : null;
}
