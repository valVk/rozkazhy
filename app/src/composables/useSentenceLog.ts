import { ref } from "vue";
import { useSqlite } from "./useSqlite";
import * as logsRepo from "../db/logsRepository";
import type { Card, SentenceLogEntry } from "../types/card";

const logs = ref<SentenceLogEntry[]>([]);

export function useSentenceLog() {
  const { getDb } = useSqlite();

  async function refresh(): Promise<void> {
    const db = await getDb();
    logs.value = await logsRepo.getRecentLogs(db, 20);
  }

  async function logSentence(cards: Card[]): Promise<void> {
    if (cards.length === 0) return;
    const db = await getDb();
    await logsRepo.addSentenceLog(
      db,
      cards.map((c) => ({ word: c.title, cardId: c.id })),
    );
    await refresh();
  }

  return { logs, refresh, logSentence };
}
