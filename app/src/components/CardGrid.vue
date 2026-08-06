<script setup lang="ts">
import type { Card } from "../types/card";
import CardTile from "./CardTile.vue";

defineProps<{ cards: Card[] }>();
const emit = defineEmits<{ (e: "tap", card: Card): void }>();
</script>

<template>
  <main>
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
      Дорослий може додати їх, довго натиснувши ⚙️ у верхньому кутку.
    </div>
  </main>
</template>

<style scoped>
main {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}
#grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 14px;
}
#emptyState {
  text-align: center;
  color: var(--gray);
  margin-top: 60px;
  font-size: 17px;
  line-height: 1.6;
}
</style>
