<script setup lang="ts">
import {
  mdiAccount,
  mdiArrowExpandAll,
  mdiCog,
  mdiContentSave,
  mdiHandshake,
  mdiHeart,
  mdiPlay,
  mdiSoccer,
  mdiStar,
  mdiToyBrickOutline,
  mdiTrashCan,
} from "@mdi/js";
import MdiIcon from "./MdiIcon.vue";

type Category = "person" | "verb" | "noun" | "descriptor" | "social";

interface MockCard {
  word: string;
  category: Category;
  icon: string;
}

const CATEGORY_COLOR: Record<Category, string> = {
  person: "var(--color-cat-person)",
  verb: "var(--color-cat-verb)",
  noun: "var(--color-cat-noun)",
  descriptor: "var(--color-cat-descriptor)",
  social: "var(--color-cat-social)",
};

const CATEGORY_TEXT: Record<Category, string> = {
  person: "var(--color-label-dark)",
  verb: "var(--color-label-light)",
  noun: "var(--color-label-dark)",
  descriptor: "var(--color-label-light)",
  social: "var(--color-label-light)",
};

// A fixed illustrative sentence — this is a static mockup, not a running app.
const stripCards: MockCard[] = [
  { word: "Будь ласка", category: "social", icon: mdiHandshake },
  { word: "Я", category: "person", icon: mdiAccount },
  { word: "хочу", category: "verb", icon: mdiHeart },
];

const gridCards: MockCard[] = [
  { word: "великий", category: "descriptor", icon: mdiArrowExpandAll },
  { word: "м'яч", category: "noun", icon: mdiSoccer },
  { word: "гратись", category: "verb", icon: mdiToyBrickOutline },
  { word: "хочу", category: "verb", icon: mdiHeart },
  { word: "Я", category: "person", icon: mdiAccount },
  { word: "дякую", category: "social", icon: mdiHandshake },
];
</script>

<template>
  <div
    class="rounded-[28px] bg-white shadow-xl shadow-ink/10 overflow-hidden max-w-sm w-full mx-auto select-none"
    aria-hidden="true"
  >
    <!-- header -->
    <div class="bg-bloom text-label-light px-5 py-4 flex items-center justify-between">
      <span class="font-bold text-lg tracking-wide">Розкажи</span>
      <div class="flex gap-2">
        <div class="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center">
          <MdiIcon :path="mdiStar" :size="18" />
        </div>
        <div class="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center">
          <MdiIcon :path="mdiCog" :size="18" />
        </div>
      </div>
    </div>

    <!-- sentence strip + play bar -->
    <div class="bg-white px-4 py-3 shadow-sm">
      <div class="flex gap-2">
        <div
          v-for="(card, i) in stripCards"
          :key="i"
          class="shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5"
          :style="{ background: CATEGORY_COLOR[card.category], color: CATEGORY_TEXT[card.category] }"
        >
          <MdiIcon :path="card.icon" :size="16" />
        </div>
      </div>
      <div class="flex items-center justify-between mt-3 px-2">
        <div class="w-10 h-10 rounded-full bg-sky flex items-center justify-center text-label-light">
          <MdiIcon :path="mdiContentSave" :size="16" />
        </div>
        <div class="w-14 h-14 rounded-full bg-moss flex items-center justify-center text-label-light shadow-md">
          <MdiIcon :path="mdiPlay" :size="26" />
        </div>
        <div class="w-10 h-10 rounded-full bg-signal flex items-center justify-center text-label-light">
          <MdiIcon :path="mdiTrashCan" :size="16" />
        </div>
      </div>
    </div>

    <!-- card grid -->
    <div class="bg-paper p-4 grid grid-cols-3 gap-3">
      <div
        v-for="(card, i) in gridCards"
        :key="i"
        class="aspect-square rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col"
      >
        <div class="flex-1" :style="{ background: CATEGORY_COLOR[card.category] + '22' }" />
        <div
          class="py-2 text-center text-[11px] font-bold"
          :style="{ background: CATEGORY_COLOR[card.category], color: CATEGORY_TEXT[card.category] }"
        >
          {{ card.word }}
        </div>
      </div>
    </div>
  </div>
</template>
