<script setup lang="ts">
import { nextTick, ref, watch, watchEffect } from "vue";
import type { Card } from "../types/card";
import { resolveMediaUrl } from "../composables/mediaUrl";

const props = defineProps<{
  cards: Card[];
  compact: boolean;
  currentIndex: number | null;
  paused: boolean;
  isPlaying: boolean;
}>();
const emit = defineEmits<{ (e: "select-frame", index: number): void }>();

const urls = ref<(string | null)[]>([]);
const scrollEl = ref<HTMLElement | null>(null);
const itemEls = ref<(HTMLElement | null)[]>([]);

watchEffect(async () => {
  urls.value = await Promise.all(
    props.cards.map((c) => resolveMediaUrl(c.imagePath)),
  );
});

// Center a frame in the visible viewport, but only if there's actually
// overflow to scroll — a strip that already fits on screen is left alone.
async function centerItem(index: number) {
  await nextTick();
  const strip = scrollEl.value;
  const item = itemEls.value[index];
  if (!strip || !item) return;
  if (strip.scrollWidth <= strip.clientWidth) return;
  const target =
    item.offsetLeft - strip.clientWidth / 2 + item.clientWidth / 2;
  const max = strip.scrollWidth - strip.clientWidth;
  strip.scrollTo({
    left: Math.max(0, Math.min(target, max)),
    behavior: "smooth",
  });
}

watch(
  () => props.currentIndex,
  (index) => {
    if (index === null) return;
    centerItem(index);
  },
);

// Newly-added cards should scroll into view the same way playback does —
// but skip this while actively playing, since currentIndex already drives
// centering there and the two would otherwise fight each other.
watch(
  () => props.cards.length,
  (newLength, oldLength) => {
    if (props.isPlaying) return;
    if (newLength > oldLength) {
      centerItem(newLength - 1);
    }
  },
);

function onItemClick(index: number) {
  if (!props.paused) return;
  emit("select-frame", index);
}
</script>

<template>
  <div id="strip" :class="{ compact }">
    <div id="stripScroll" ref="scrollEl">
      <div
        v-if="cards.length === 0"
        class="strip-empty-hint"
      >
        Торкніться картки, щоб почати 👇
      </div>
      <div
        v-for="(card, i) in cards"
        :key="i"
        :ref="(el) => (itemEls[i] = el as HTMLElement | null)"
        class="strip-item"
        :class="{ active: i === currentIndex, selectable: paused }"
        @click="onItemClick(i)"
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
    height 0.25s ease,
    outline-color 0.15s ease;
}
#strip.compact .strip-item {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border-width: 1px;
}
.strip-item.active {
  outline: 3px solid var(--yellow);
  outline-offset: 1px;
}
.strip-item.selectable {
  cursor: pointer;
}
.strip-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
