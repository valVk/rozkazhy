export interface Card {
  id: number;
  title: string;
  imagePath: string;
  audioPath: string | null;
  tapCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface SentenceLogEntry {
  id: number;
  playedAt: number;
  words: string[];
}

export interface Sequence {
  id: number;
  name: string | null;
  isFavorite: boolean;
  favoriteAuto: boolean;
  usageCount: number;
  createdAt: number;
  lastUsedAt: number | null;
  cardIds: number[];
}
