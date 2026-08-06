<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { Card } from "../types/card";
import { resolveMediaUrl } from "../composables/mediaUrl";

const props = defineProps<{ card: Card }>();
const emit = defineEmits<{ (e: "tap", card: Card): void }>();

const imageUrl = ref<string | null>(null);
const glow = ref(false);

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
    <img v-if="imageUrl" class="thumb" :src="imageUrl" :alt="card.title" />
    <div v-else class="thumb thumb-placeholder"></div>
    <div class="label">{{ card.title }}</div>
  </button>
</template>

<style scoped>
.card {
  background: white;
  border-radius: var(--radius);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  transition: transform 0.08s ease;
}
.card:active {
  transform: scale(0.94);
}
.thumb {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  background: #eee;
  display: block;
}
.thumb-placeholder {
  background: #eee;
}
.label {
  padding: 8px 6px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: var(--dark);
}
.card.active-glow {
  outline: 4px solid var(--yellow);
}
</style>
