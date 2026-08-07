<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import type { Card } from "../types/card";
import { resolveMediaUrl } from "../composables/mediaUrl";
import { getContrastTextColor, useCardCategories } from "../composables/useCardCategories";

const props = defineProps<{ card: Card }>();
const emit = defineEmits<{ (e: "tap", card: Card): void }>();

const { coloringEnabled, categoryColors } = useCardCategories();

const imageUrl = ref<string | null>(null);
const glow = ref(false);

const categoryColor = computed(() => {
  if (!coloringEnabled.value || !props.card.category) return null;
  return categoryColors.value[props.card.category];
});

const labelStyle = computed(() => {
  const bg = categoryColor.value;
  if (!bg) return undefined;
  return { background: bg, color: getContrastTextColor(bg) };
});

watchEffect(async () => {
  imageUrl.value = await resolveMediaUrl(props.card.imagePath);
});

function onTap() {
  glow.value = true;
  setTimeout(() => (glow.value = false), 400);
  emit("tap", props.card);
}
</script>

<template>
  <button class="card" :class="{ 'active-glow': glow }" @click="onTap">
    <div
      v-if="categoryColor"
      class="category-stripe"
      :style="{ background: categoryColor }"
    />
    <img v-if="imageUrl" class="thumb" :src="imageUrl" :alt="card.title" />
    <div v-else class="thumb thumb-placeholder"></div>
    <div class="label" :style="labelStyle">
      {{ card.title }}
    </div>
  </button>
</template>

<style scoped>
.card {
  background: white;
  border-radius: var(--radius);
  box-shadow: 0 1px 4px rgba(43, 42, 51, 0.06);
  overflow: hidden;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.08s ease,
    box-shadow 0.15s ease;
}
.card:active {
  transform: scale(0.96);
  box-shadow: 0 1px 2px rgba(43, 42, 51, 0.06);
}
.category-stripe {
  height: 6px;
  width: 100%;
  flex-shrink: 0;
}
.thumb {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  background: #f4f2ee;
  display: block;
}
.thumb-placeholder {
  background: #f4f2ee;
}
.label {
  padding: 10px 8px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: var(--ink);
}
.card.active-glow {
  outline: 3px solid var(--sun);
  outline-offset: 2px;
}
</style>
