import { ref } from "vue";
import { Preferences } from "@capacitor/preferences";
import { useSqlite } from "./useSqlite";
import * as sequencesRepo from "../db/sequencesRepository";
import type { Card, Sequence } from "../types/card";

const sequences = ref<Sequence[]>([]);
const THRESHOLD_KEY = "sequence_favorite_threshold";
const DEFAULT_THRESHOLD = 5;

export function useSequences() {
  const { getDb } = useSqlite();

  async function refresh(): Promise<void> {
    const db = await getDb();
    sequences.value = await sequencesRepo.getAllSequences(db);
  }

  async function getFavoriteThreshold(): Promise<number> {
    const { value } = await Preferences.get({ key: THRESHOLD_KEY });
    const n = value ? parseInt(value, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_THRESHOLD;
  }

  async function setFavoriteThreshold(n: number): Promise<void> {
    await Preferences.set({ key: THRESHOLD_KEY, value: String(n) });
  }

  async function saveCurrent(
    cards: Card[],
    name: string | null = null,
  ): Promise<void> {
    if (cards.length === 0) return;
    const db = await getDb();
    const finalName = name ?? cards.map((c) => c.title).join(" ");
    await sequencesRepo.createSequence(
      db,
      cards.map((c) => c.id),
      finalName,
    );
    await refresh();
  }

  async function replay(id: number): Promise<void> {
    const db = await getDb();
    const { usageCount, isFavorite } = await sequencesRepo.recordSequenceUsage(
      db,
      id,
    );
    if (!isFavorite) {
      const threshold = await getFavoriteThreshold();
      if (usageCount >= threshold) {
        await sequencesRepo.setSequenceFavoriteAuto(db, id);
      }
    }
    await refresh();
  }

  async function toggleFavorite(id: number, isFavorite: boolean): Promise<void> {
    const db = await getDb();
    await sequencesRepo.setSequenceFavoriteManual(db, id, isFavorite);
    await refresh();
  }

  async function remove(id: number): Promise<void> {
    const db = await getDb();
    await sequencesRepo.deleteSequence(db, id);
    await refresh();
  }

  return {
    sequences,
    refresh,
    saveCurrent,
    replay,
    toggleFavorite,
    remove,
    getFavoriteThreshold,
    setFavoriteThreshold,
  };
}
