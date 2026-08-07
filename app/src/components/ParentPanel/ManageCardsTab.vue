<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { mdiPencil, mdiTrashCan } from "@mdi/js";
import { useCards } from "../../composables/useCards";
import { resolveMediaUrl } from "../../composables/mediaUrl";
import { useAppStore } from "../../stores/appStore";
import MdiIcon from "../shared/MdiIcon.vue";
import type { Card } from "../../types/card";

const emit = defineEmits<{ (e: "edit", card: Card): void }>();

const { cards, refresh, deleteCard } = useCards();
const store = useAppStore();
const thumbUrls = ref<Record<number, string | null>>({});

onMounted(refresh);

watchEffect(async () => {
  const entries = await Promise.all(
    cards.value.map(async (c) => [c.id, await resolveMediaUrl(c.imagePath)] as const),
  );
  thumbUrls.value = Object.fromEntries(entries);
});

async function onDelete(card: Card) {
  if (!confirm(`Видалити картку "${card.title}"?`)) return;
  await deleteCard(card.id);
  store.showToast("Видалено");
}
</script>

<template>
  <div>
    <p v-if="cards.length === 0" class="empty">Ще немає карток.</p>
    <div v-for="card in cards" :key="card.id" class="card-list-item">
      <img v-if="thumbUrls[card.id]" :src="thumbUrls[card.id]!" />
      <div class="word">{{ card.title }}</div>
      <button class="icon-btn" @click="emit('edit', card)">
        <MdiIcon :path="mdiPencil" :size="18" />
      </button>
      <button class="icon-btn" @click="onDelete(card)">
        <MdiIcon :path="mdiTrashCan" :size="18" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.empty {
  color: var(--gray);
}
.card-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 10px;
}
.card-list-item img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
}
.word {
  flex: 1;
  font-weight: 700;
  font-size: 16px;
}
.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
