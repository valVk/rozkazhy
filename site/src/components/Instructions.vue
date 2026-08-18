<script setup lang="ts">
import { computed } from "vue";
import { marked } from "marked";
// Single source of truth: the repo's own README, not a hand-copied
// duplicate that would drift out of sync. Renders inline so a parent
// never has to click through to GitHub to read it.
import readmeRaw from "../../../README.md?raw";

const START_MARKER = "## UA";
const END_MARKER = "### Технології";

const html = computed(() => {
  const start = readmeRaw.indexOf(START_MARKER);
  const end = readmeRaw.indexOf(END_MARKER);
  if (start === -1 || end === -1) return "";
  const section = readmeRaw
    .slice(start + START_MARKER.length, end)
    // Shift heading levels up by one (### -> ##, #### -> ###) so this
    // reads as a page section, not a nested doc starting mid-hierarchy.
    // A single-pass callback avoids re-matching already-shifted headings.
    .replace(/^(#{3,4}) /gm, (_match, hashes: string) => hashes.slice(1) + " ");
  return marked.parse(section, { async: false });
});
</script>

<template>
  <section id="instructions" class="py-16 sm:py-24 bg-white">
    <div class="max-w-2xl mx-auto px-6">
      <p class="text-xs font-bold tracking-widest uppercase text-mist mb-3 text-center">
        Детальна інструкція
      </p>
      <div class="md-content" v-html="html" />
    </div>
  </section>
</template>

<style scoped>
.md-content :deep(h2) {
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0 12px;
}
.md-content :deep(h2:first-child) {
  margin-top: 0;
}
.md-content :deep(h3) {
  font-size: 18px;
  font-weight: 700;
  margin: 28px 0 10px;
}
.md-content :deep(p) {
  line-height: 1.7;
  color: var(--color-ink);
  margin: 10px 0;
}
.md-content :deep(ul),
.md-content :deep(ol) {
  padding-left: 22px;
  line-height: 1.7;
  margin: 10px 0;
}
.md-content :deep(li) {
  margin: 6px 0;
}
.md-content :deep(li > ul),
.md-content :deep(li > ol) {
  margin: 4px 0;
}
.md-content :deep(strong) {
  font-weight: 700;
}
.md-content :deep(code) {
  background: var(--color-paper);
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 0.9em;
}
</style>
