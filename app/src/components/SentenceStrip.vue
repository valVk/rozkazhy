<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { Card } from "../types/card";
import { resolveMediaUrl } from "../composables/mediaUrl";

const props = defineProps<{ cards: Card[] }>();
const emit = defineEmits<{
  (e: "play"): void;
  (e: "clear"): void;
  (e: "save"): void;
}>();

const urls = ref<(string | null)[]>([]);

watchEffect(async () => {
  urls.value = await Promise.all(
    props.cards.map((c) => resolveMediaUrl(c.imagePath)),
  );
});
</script>

<template>
  <div id="strip">
    <div id="stripScroll">
      <div
        v-if="cards.length === 0"
        class="strip-empty-hint"
      >
        Торкніться картки, щоб почати 👇
      </div>
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="strip-item"
      >
        <img v-if="urls[i]" :src="urls[i]!" :alt="card.title" />
      </div>
    </div>
    <div class="strip-actions">
      <button
        id="saveStripBtn"
        class="round-btn"
        :disabled="cards.length === 0"
        title="Зберегти послідовність"
        @click="emit('save')"
      >
        💾
      </button>
      <button
        id="playStripBtn"
        class="round-btn"
        :disabled="cards.length === 0"
        title="Відтворити"
        @click="emit('play')"
      >
        ▶
      </button>
      <button
        id="clearStripBtn"
        class="round-btn"
        :disabled="cards.length === 0"
        title="Очистити"
        @click="emit('clear')"
      >
        🗑
      </button>
    </div>
  </div>
</template>

<style scoped>
#strip {
  flex-shrink: 0;
  background: white;
  border-bottom: 3px solid var(--teal);
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
#stripScroll {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  min-height: 70px;
  align-items: center;
  padding: 4px;
}
.strip-empty-hint {
  color: var(--gray);
  font-size: 15px;
  padding-left: 6px;
}
.strip-item {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid var(--teal);
  position: relative;
  background: #fff;
}
.strip-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.strip-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.round-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}
#saveStripBtn {
  background: var(--teal);
}
#playStripBtn {
  background: #4caf80;
}
#clearStripBtn {
  background: var(--danger);
}
.round-btn:disabled {
  opacity: 0.35;
}
</style>
