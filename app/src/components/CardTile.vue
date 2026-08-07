<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import type { Card } from "../types/card";
import { resolveMediaUrl } from "../composables/mediaUrl";
import {
  LABEL_TEXT_DARK,
  LABEL_TEXT_LIGHT,
  SWATCH_TEXT_COLOR,
  useCardCategories,
} from "../composables/useCardCategories";

const props = defineProps<{ card: Card }>();
const emit = defineEmits<{ (e: "tap", card: Card): void }>();

const { coloringEnabled, categoryColors } = useCardCategories();

const imageUrl = ref<string | null>(null);
const glow = ref(false);

const categoryColor = computed(() => {
  if (!coloringEnabled.value || !props.card.category) return null;
  return categoryColors.value[props.card.category];
});

// Whichever of the two label tones actually passes WCAG AA against this
// specific color — a flat "colored = always light text" rule fails
// contrast for lighter presets like gold or teal.
function relativeLuminance(hex: string): number {
  const toLinear = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(parseInt(hex.slice(1, 3), 16));
  const g = toLinear(parseInt(hex.slice(3, 5), 16));
  const b = toLinear(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const labelTextColor = computed(() => {
  const hex = categoryColor.value;
  if (!hex) return null;
  const known = SWATCH_TEXT_COLOR[hex.toUpperCase()];
  if (known) return known === "light" ? LABEL_TEXT_LIGHT : LABEL_TEXT_DARK;
  // Fallback for a color not in the known preset map: pick whichever tone
  // has the higher contrast ratio against it.
  const l = relativeLuminance(hex);
  const lightLuminance = relativeLuminance(LABEL_TEXT_LIGHT);
  const darkLuminance = relativeLuminance(LABEL_TEXT_DARK);
  const contrastLight = (lightLuminance + 0.05) / (l + 0.05);
  const contrastDark = (l + 0.05) / (darkLuminance + 0.05);
  return contrastLight >= contrastDark ? LABEL_TEXT_LIGHT : LABEL_TEXT_DARK;
});

const labelStyle = computed(() => {
  const bg = categoryColor.value;
  if (!bg) return undefined;
  return { background: bg, color: labelTextColor.value ?? LABEL_TEXT_DARK };
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
