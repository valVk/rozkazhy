<script setup lang="ts">
import { onMounted, ref } from "vue";
import { mdiClose, mdiContentSave, mdiDragVertical } from "@mdi/js";
import type { Sequence } from "../types/card";
import { useCards } from "../composables/useCards";
import { useSequences } from "../composables/useSequences";
import { resolveMediaUrl } from "../composables/mediaUrl";
import MdiIcon from "./shared/MdiIcon.vue";

const props = defineProps<{ sequence: Sequence }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

interface Row {
  itemId: number;
  cardId: number;
  title: string;
  imageUrl: string | null;
}

const { cards } = useCards();
const { updateItems } = useSequences();

const rows = ref<Row[]>([]);
const rowEls = ref<(HTMLElement | null)[]>([]);
const draggingIndex = ref<number | null>(null);
const saving = ref(false);

onMounted(async () => {
  rows.value = await Promise.all(
    props.sequence.items.map(async (item) => {
      const card = cards.value.find((c) => c.id === item.cardId);
      return {
        itemId: item.itemId,
        cardId: item.cardId,
        title: card?.title ?? "?",
        imageUrl: card ? await resolveMediaUrl(card.imagePath) : null,
      };
    }),
  );
});

function removeRow(index: number) {
  rows.value.splice(index, 1);
}

function onHandlePointerDown(index: number, event: PointerEvent) {
  draggingIndex.value = index;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
}

function onPointerMove(event: PointerEvent) {
  if (draggingIndex.value === null) return;
  const from = draggingIndex.value;
  for (let i = 0; i < rowEls.value.length; i++) {
    const el = rowEls.value[i];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (event.clientY >= rect.top && event.clientY <= rect.bottom && i !== from) {
      const [moved] = rows.value.splice(from, 1);
      rows.value.splice(i, 0, moved);
      draggingIndex.value = i;
      break;
    }
  }
}

function onPointerUp() {
  draggingIndex.value = null;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
}

async function onSave() {
  saving.value = true;
  await updateItems(
    props.sequence.id,
    rows.value.map((r) => r.cardId),
  );
  saving.value = false;
  emit("saved");
}
</script>

<template>
  <div class="overlay">
    <div class="sheet">
      <div class="sheet-body">
        <div class="sheet-header">
          <h2>Редагувати послідовність</h2>
          <button class="sheet-close" @click="emit('close')">
            <MdiIcon :path="mdiClose" :size="22" />
          </button>
        </div>
        <p class="hint">Перетягніть за ручку, щоб змінити порядок, або видаліть картку.</p>

        <div v-if="rows.length === 0" class="empty">
          Усі картки видалено. Збереження видалить послідовність.
        </div>

        <div
          v-for="(row, index) in rows"
          :key="row.itemId"
          :ref="(el) => (rowEls[index] = el as HTMLElement | null)"
          class="edit-row"
          :class="{ dragging: draggingIndex === index }"
        >
          <button class="drag-handle" @pointerdown="onHandlePointerDown(index, $event)">
            <MdiIcon :path="mdiDragVertical" :size="22" />
          </button>
          <img v-if="row.imageUrl" :src="row.imageUrl" class="thumb" />
          <span class="row-title">{{ row.title }}</span>
          <button class="icon-btn" @click="removeRow(index)">
            <MdiIcon :path="mdiClose" :size="18" />
          </button>
        </div>

        <div class="row" style="margin-top: 16px">
          <button class="btn btn-secondary" @click="emit('close')">Скасувати</button>
          <button class="btn btn-primary" style="margin-top: 0" :disabled="saving" @click="onSave">
            <MdiIcon :path="mdiContentSave" :size="18" />
            Зберегти
          </button>
        </div>
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
  z-index: 60;
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
.hint {
  color: var(--mist);
  font-size: 14px;
  margin-top: 0;
}
.empty {
  color: var(--mist);
  text-align: center;
  margin-top: 20px;
}
.edit-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border-radius: 16px;
  padding: 8px 10px;
  margin-bottom: 8px;
  touch-action: none;
}
.edit-row.dragging {
  outline: 2px solid var(--bloom);
}
.drag-handle {
  background: none;
  border: none;
  color: var(--mist);
  cursor: grab;
  padding: 6px;
  min-width: 44px;
  min-height: 44px;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
}
.row-title {
  flex: 1;
  font-weight: 700;
  font-size: 15px;
}
.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
