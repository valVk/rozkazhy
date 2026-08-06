<script setup lang="ts">
import { onMounted } from "vue";
import { useSequences } from "../composables/useSequences";
import { useCards } from "../composables/useCards";
import type { Sequence } from "../types/card";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "replay", cardIds: number[]): void;
}>();

const { sequences, refresh, replay, toggleFavorite, remove } = useSequences();
const { cards } = useCards();

onMounted(refresh);

function seqTitle(seq: Sequence): string {
  if (seq.name) return seq.name;
  return seq.cardIds
    .map((id) => cards.value.find((c) => c.id === id)?.title ?? "?")
    .join(" • ");
}

async function onReplay(seq: Sequence) {
  await replay(seq.id);
  emit("replay", seq.cardIds);
}
</script>

<template>
  <div class="overlay">
    <div class="sheet">
      <button class="sheet-close" @click="emit('close')">✕</button>
      <h2>Послідовності</h2>
      <div v-if="sequences.length === 0" class="empty">
        Ще немає збережених послідовностей.
      </div>
      <div v-for="seq in sequences" :key="seq.id" class="seq-item">
        <button class="seq-body" @click="onReplay(seq)">
          <span class="seq-name">{{ seqTitle(seq) }}</span>
          <span class="seq-meta">Використано: {{ seq.usageCount }}</span>
        </button>
        <button
          class="icon-btn"
          :class="{ active: seq.isFavorite }"
          @click="toggleFavorite(seq.id, !seq.isFavorite)"
        >
          {{ seq.isFavorite ? "⭐" : "☆" }}
        </button>
        <button class="icon-btn" @click="remove(seq.id)">🗑</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 30, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 50;
}
.sheet {
  background: var(--cream);
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 26px 26px 0 0;
  padding: 20px;
}
.sheet-close {
  position: sticky;
  top: 0;
  float: right;
  background: none;
  border: none;
  font-size: 26px;
  color: var(--gray);
  cursor: pointer;
}
.empty {
  color: var(--gray);
  text-align: center;
  margin-top: 20px;
}
.seq-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 10px;
}
.seq-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}
.seq-name {
  font-weight: 700;
  font-size: 16px;
}
.seq-meta {
  font-size: 12px;
  color: var(--gray);
}
.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  font-size: 18px;
  flex-shrink: 0;
  cursor: pointer;
}
.icon-btn.active {
  background: var(--yellow);
}
</style>
