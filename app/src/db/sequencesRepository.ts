import type { SQLiteDBConnection } from "@capacitor-community/sqlite";
import type { Sequence } from "../types/card";

interface SequenceRow {
  id: number;
  name: string | null;
  is_favorite: number;
  favorite_auto: number;
  usage_count: number;
  created_at: number;
  last_used_at: number | null;
}

async function attachCardIds(
  db: SQLiteDBConnection,
  rows: SequenceRow[],
): Promise<Sequence[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const placeholders = ids.map(() => "?").join(",");
  const itemsRes = await db.query(
    `SELECT sequence_id, card_id FROM sequence_items WHERE sequence_id IN (${placeholders}) ORDER BY sequence_id, position ASC;`,
    ids,
  );
  const itemRows =
    (itemsRes.values as
      | { sequence_id: number; card_id: number }[]
      | undefined) ?? [];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    isFavorite: !!row.is_favorite,
    favoriteAuto: !!row.favorite_auto,
    usageCount: row.usage_count,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    cardIds: itemRows
      .filter((i) => i.sequence_id === row.id)
      .map((i) => i.card_id),
  }));
}

export async function getAllSequences(
  db: SQLiteDBConnection,
): Promise<Sequence[]> {
  const res = await db.query(
    `SELECT * FROM sequences ORDER BY is_favorite DESC, last_used_at DESC, created_at DESC;`,
  );
  const rows = (res.values as SequenceRow[] | undefined) ?? [];
  return attachCardIds(db, rows);
}

export async function createSequence(
  db: SQLiteDBConnection,
  cardIds: number[],
  name: string | null,
): Promise<number> {
  const now = Date.now();
  const res = await db.run(
    `INSERT INTO sequences (name, is_favorite, favorite_auto, usage_count, created_at, last_used_at)
     VALUES (?, 0, 0, 0, ?, NULL);`,
    [name, now],
  );
  const id = res.changes?.lastId ?? -1;
  for (let i = 0; i < cardIds.length; i++) {
    await db.run(
      `INSERT INTO sequence_items (sequence_id, position, card_id) VALUES (?, ?, ?);`,
      [id, i, cardIds[i]],
    );
  }
  return id;
}

export async function recordSequenceUsage(
  db: SQLiteDBConnection,
  id: number,
): Promise<{ usageCount: number; isFavorite: boolean }> {
  const now = Date.now();
  await db.run(
    `UPDATE sequences SET usage_count = usage_count + 1, last_used_at = ? WHERE id = ?;`,
    [now, id],
  );
  const res = await db.query(
    `SELECT usage_count, is_favorite FROM sequences WHERE id = ?;`,
    [id],
  );
  const row = (
    res.values as { usage_count: number; is_favorite: number }[] | undefined
  )?.[0];
  return {
    usageCount: row?.usage_count ?? 0,
    isFavorite: !!row?.is_favorite,
  };
}

export async function setSequenceFavoriteAuto(
  db: SQLiteDBConnection,
  id: number,
): Promise<void> {
  await db.run(
    `UPDATE sequences SET is_favorite = 1, favorite_auto = 1 WHERE id = ?;`,
    [id],
  );
}

export async function setSequenceFavoriteManual(
  db: SQLiteDBConnection,
  id: number,
  isFavorite: boolean,
): Promise<void> {
  await db.run(
    `UPDATE sequences SET is_favorite = ?, favorite_auto = 0 WHERE id = ?;`,
    [isFavorite ? 1 : 0, id],
  );
}

export async function deleteSequence(
  db: SQLiteDBConnection,
  id: number,
): Promise<void> {
  await db.run(`DELETE FROM sequences WHERE id = ?;`, [id]);
}

export async function deleteEmptySequences(
  db: SQLiteDBConnection,
): Promise<void> {
  await db.run(
    `DELETE FROM sequences WHERE id NOT IN (SELECT DISTINCT sequence_id FROM sequence_items);`,
  );
}
