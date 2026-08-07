<script setup lang="ts">
import { onMounted, ref } from "vue";
import { mdiClose, mdiPencil, mdiStar, mdiStarOutline, mdiTrashCan } from "@mdi/js";
import { useSequences } from "../composables/useSequences";
import { useCards } from "../composables/useCards";
import SequenceEditor from "./SequenceEditor.vue";
import MdiIcon from "./shared/MdiIcon.vue";
import type { Sequence } from "../types/card";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "replay", cardIds: number[]): void;
}>();

const { sequences, refresh, replay, toggleFavorite, remove } = useSequences();
const { cards } = useCards();

const editingSequence = ref<Sequence | null>(null);

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

function onEditSaved() {
  editingSequence.value = null;
  refresh();
}
</script>

<template>
  <div class="overlay">
    <div class="sheet">
      <div class="sheet-body">
        <div class="sheet-header">
          <h2>Послідовності</h2>
          <button class="sheet-close" @click="emit('close')">
            <MdiIcon :path="mdiClose" :size="22" />
          </button>
        </div>
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
            <MdiIcon :path="seq.isFavorite ? mdiStar : mdiStarOutline" :size="18" />
          </button>
          <button class="icon-btn" @click="editingSequence = seq">
            <MdiIcon :path="mdiPencil" :size="18" />
          </button>
          <button class="icon-btn" @click="remove(seq.id)">
            <MdiIcon :path="mdiTrashCan" :size="18" />
          </button>
        </div>
      </div>
    </div>

    <SequenceEditor
      v-if="editingSequence"
      :sequence="editingSequence"
      @close="editingSequence = null"
      @saved="onEditSaved"
    />
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
  position: relative;
  background: var(--paper);
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  border-radius: 26px 26px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sheet-body {
  overflow-y: auto;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
  scrollbar-width: none;
}
.sheet-body::-webkit-scrollbar {
  display: none;
}
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.sheet-header h2 {
  margin: 0;
}
.sheet-close {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  color: var(--mist);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty {
  color: var(--mist);
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
  color: var(--mist);
}
.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn.active {
  background: var(--sun);
}
</style>
