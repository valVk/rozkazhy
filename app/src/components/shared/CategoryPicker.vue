<script setup lang="ts">
import { CATEGORY_LABELS, CATEGORY_ORDER } from "../../composables/useCardCategories";
import type { CardCategory } from "../../types/card";

defineProps<{
  modelValue: CardCategory | null;
  colors: Record<CardCategory, string>;
  compact?: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: CardCategory | null): void;
}>();
</script>

<template>
  <div class="category-picker" :class="{ compact }">
    <button
      type="button"
      class="chip none"
      :class="{ active: modelValue === null }"
      title="Без категорії"
      @click="emit('update:modelValue', null)"
    >
      <span class="dot none-dot" />
      <span v-if="!compact" class="chip-label">Без категорії</span>
    </button>
    <button
      v-for="cat in CATEGORY_ORDER"
      :key="cat"
      type="button"
      class="chip"
      :class="{ active: modelValue === cat }"
      :title="CATEGORY_LABELS[cat]"
      @click="emit('update:modelValue', cat)"
    >
      <span class="dot" :style="{ background: colors[cat] }" />
      <span v-if="!compact" class="chip-label">{{ CATEGORY_LABELS[cat] }}</span>
    </button>
  </div>
</template>

<style scoped>
.category-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 2px solid transparent;
  background: white;
  border-radius: 999px;
  padding: 6px 12px 6px 6px;
  min-height: 44px;
  cursor: pointer;
}
.chip.active {
  border-color: var(--ink);
}
.dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
}
.none-dot {
  background: white;
  border: 2px solid #d8d3c8;
}
.chip-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}
.category-picker.compact .chip {
  padding: 4px;
  min-height: 36px;
  min-width: 36px;
  justify-content: center;
}
.category-picker.compact .dot {
  width: 20px;
  height: 20px;
}
</style>
