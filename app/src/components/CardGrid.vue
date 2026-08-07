<script setup lang="ts">
import { ref } from "vue";
import { mdiCog } from "@mdi/js";
import type { Card } from "../types/card";
import CardTile from "./CardTile.vue";
import MdiIcon from "./shared/MdiIcon.vue";

defineProps<{ cards: Card[] }>();
const emit = defineEmits<{
  (e: "tap", card: Card): void;
  (e: "compact", value: boolean): void;
}>();

const isCompact = ref(false);
const EXPAND_THRESHOLD = 6;
const COMPACT_THRESHOLD = 32;

function onScroll(e: Event) {
  const scrollTop = (e.target as HTMLElement).scrollTop;
  if (!isCompact.value && scrollTop > COMPACT_THRESHOLD) {
    isCompact.value = true;
    emit("compact", true);
  } else if (isCompact.value && scrollTop <= EXPAND_THRESHOLD) {
    isCompact.value = false;
    emit("compact", false);
  }
}
</script>

<template>
  <main @scroll="onScroll">
    <div v-if="cards.length" id="grid">
      <CardTile
        v-for="card in cards"
        :key="card.id"
        :card="card"
        @tap="(c) => emit('tap', c)"
      />
    </div>
    <div v-else id="emptyState">
      Поки немає жодної картки.<br />
      Дорослий може додати їх, довго натиснувши
      <MdiIcon :path="mdiCog" :size="16" />
      у верхньому кутку.
    </div>
  </main>
</template>

<style scoped>
main {
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px calc(14px + env(safe-area-inset-bottom));
}
#grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 14px;
}
#emptyState {
  text-align: center;
  color: var(--mist);
  margin-top: 60px;
  font-size: 17px;
  line-height: 1.6;
}
</style>
