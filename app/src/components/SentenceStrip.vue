<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { Card } from "../types/card";
import { resolveMediaUrl } from "../composables/mediaUrl";

const props = defineProps<{ cards: Card[]; compact: boolean }>();

const urls = ref<(string | null)[]>([]);

watchEffect(async () => {
  urls.value = await Promise.all(
    props.cards.map((c) => resolveMediaUrl(c.imagePath)),
  );
});
</script>

<template>
  <div id="strip" :class="{ compact }">
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
  </div>
</template>

<style scoped>
#strip {
  flex-shrink: 0;
  background: white;
  border-bottom: 3px solid var(--teal);
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: padding 0.25s ease;
}
#strip.compact {
  padding: 2px 8px;
}
#stripScroll {
  flex: 1;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  min-height: 52px;
  align-items: center;
  padding: 2px;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
  transition: min-height 0.25s ease;
}
#strip.compact #stripScroll {
  min-height: 30px;
}
.strip-empty-hint {
  color: var(--gray);
  font-size: 15px;
  padding-left: 6px;
}
.strip-item {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--teal);
  position: relative;
  background: #fff;
  transition:
    width 0.25s ease,
    height 0.25s ease;
}
#strip.compact .strip-item {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border-width: 1px;
}
.strip-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
