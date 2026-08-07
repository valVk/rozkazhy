<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { mdiPencil, mdiTrashCan } from "@mdi/js";
import { useCards } from "../../composables/useCards";
import { resolveMediaUrl } from "../../composables/mediaUrl";
import { useAppStore } from "../../stores/appStore";
import {
  CATEGORY_LABELS,
  useCardCategories,
} from "../../composables/useCardCategories";
import MdiIcon from "../shared/MdiIcon.vue";
import CategoryPicker from "../shared/CategoryPicker.vue";
import type { Card, CardCategory } from "../../types/card";

const emit = defineEmits<{ (e: "edit", card: Card): void }>();

const { cards, refresh, deleteCard, updateCardCategory } = useCards();
const store = useAppStore();
const { coloringEnabled, categoryColors } = useCardCategories();
const thumbUrls = ref<Record<number, string | null>>({});

onMounted(refresh);

async function onCategoryChange(card: Card, category: CardCategory | null) {
  await updateCardCategory(card.id, category);
}

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
      <div class="row-top">
        <img v-if="thumbUrls[card.id]" :src="thumbUrls[card.id]!" />
        <div class="word">{{ card.title }}</div>
        <button class="icon-btn" @click="emit('edit', card)">
          <MdiIcon :path="mdiPencil" :size="18" />
        </button>
        <button class="icon-btn" @click="onDelete(card)">
          <MdiIcon :path="mdiTrashCan" :size="18" />
        </button>
      </div>
      <template v-if="coloringEnabled">
        <div class="row-divider" />
        <div class="category-hint">
          <span
            v-if="card.category"
            class="legend-dot"
            :style="{ background: categoryColors[card.category] }"
          />
          {{ card.category ? CATEGORY_LABELS[card.category] : "Без категорії" }}
        </div>
        <CategoryPicker
          class="row-category"
          compact
          :model-value="card.category"
          :colors="categoryColors"
          @update:model-value="(cat) => onCategoryChange(card, cat)"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.empty {
  color: var(--mist);
}
.card-list-item {
  background: white;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 10px;
}
.row-top {
  display: flex;
  align-items: center;
  gap: 12px;
}
.row-divider {
  margin-top: 10px;
  border-top: 1px solid rgba(43, 42, 51, 0.08);
}
.category-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  color: var(--mist);
  font-size: 12px;
}
.row-category {
  margin-top: 8px;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
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
