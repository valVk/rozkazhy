import { ref } from "vue";
import { useSqlite } from "./useSqlite";
import { deleteMediaFile } from "./mediaUrl";
import * as cardsRepo from "../db/cardsRepository";
import type { Card, CardCategory } from "../types/card";

const cards = ref<Card[]>([]);

export function useCards() {
  const { getDb } = useSqlite();

  async function refresh(): Promise<void> {
    const db = await getDb();
    cards.value = await cardsRepo.getAllCards(db);
  }

  async function addCard(data: {
    title: string;
    imagePath: string;
    audioPath: string | null;
    category?: CardCategory | null;
  }): Promise<void> {
    const db = await getDb();
    await cardsRepo.insertCard(db, { ...data, category: data.category ?? null });
    await refresh();
  }

  async function updateCardMeta(id: number, title: string): Promise<void> {
    const db = await getDb();
    await cardsRepo.updateCardMeta(db, id, { title });
    await refresh();
  }

  async function updateCardCategory(
    id: number,
    category: CardCategory | null,
  ): Promise<void> {
    const db = await getDb();
    await cardsRepo.updateCardCategory(db, id, category);
    await refresh();
  }

  async function updateCardImage(
    id: number,
    newImagePath: string,
  ): Promise<void> {
    const db = await getDb();
    const existing = await cardsRepo.getCardById(db, id);
    await cardsRepo.updateCardImage(db, id, newImagePath);
    if (existing?.imagePath) await deleteMediaFile(existing.imagePath);
    await refresh();
  }

  async function updateCardAudio(
    id: number,
    newAudioPath: string | null,
  ): Promise<void> {
    const db = await getDb();
    const existing = await cardsRepo.getCardById(db, id);
    await cardsRepo.updateCardAudio(db, id, newAudioPath);
    if (existing?.audioPath) await deleteMediaFile(existing.audioPath);
    await refresh();
  }

  async function incrementTapCount(id: number): Promise<void> {
    const db = await getDb();
    await cardsRepo.incrementTapCount(db, id);
    await refresh();
  }

  async function deleteCard(id: number): Promise<void> {
    const db = await getDb();
    const existing = await cardsRepo.getCardById(db, id);
    await cardsRepo.deleteCard(db, id);
    if (existing?.imagePath) await deleteMediaFile(existing.imagePath);
    if (existing?.audioPath) await deleteMediaFile(existing.audioPath);
    await refresh();
  }

  return {
    cards,
    refresh,
    addCard,
    updateCardMeta,
    updateCardCategory,
    updateCardImage,
    updateCardAudio,
    incrementTapCount,
    deleteCard,
  };
}
