<script setup lang="ts">
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  getContrastTextColor,
} from "../../composables/useCardCategories";
import type { CardCategory } from "../../types/card";

defineProps<{
  modelValue: CardCategory | null;
  colors: Record<CardCategory, string>;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: CardCategory | null): void;
}>();
</script>

<template>
  <div class="filter-row">
    <button
      type="button"
      class="filter-chip all"
      :class="{ active: modelValue === null }"
      @click="emit('update:modelValue', null)"
    >
      Усі
    </button>
    <button
      v-for="cat in CATEGORY_ORDER"
      :key="cat"
      type="button"
      class="filter-chip"
      :class="{ active: modelValue === cat }"
      :style="{ background: colors[cat], color: getContrastTextColor(colors[cat]) }"
      @click="emit('update:modelValue', cat)"
    >
      {{ CATEGORY_LABELS[cat] }}
    </button>
  </div>
</template>

<style scoped>
.filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  margin-bottom: 14px;
  -webkit-overflow-scrolling: touch;
}
.filter-chip {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 9px 16px;
  min-height: 40px;
  border-radius: 999px;
  border: 3px solid transparent;
  background: white;
  color: var(--ink);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
.filter-chip.active {
  border-color: var(--ink);
}
</style>
