<script setup lang="ts">
import { mdiCardsOutline, mdiHandPointingUp, mdiVolumeHigh } from "@mdi/js";
import MdiIcon from "./MdiIcon.vue";

const steps = [
  {
    n: "01",
    icon: mdiHandPointingUp,
    title: "Дитина торкається картки",
    text: "Кожна картка — фото предмета чи дії та підписане слово.",
  },
  {
    n: "02",
    icon: mdiVolumeHigh,
    title: "Картка каже слово",
    text: "Голосом рідної людини, записаним заздалегідь — або синтезованим, якщо запису немає.",
  },
  {
    n: "03",
    icon: mdiCardsOutline,
    title: "Речення збирається саме",
    text: "Картки одна за одною складаються у стрічку — щоб потім відтворити ціле речення одним дотиком.",
  },
];
</script>

<template>
  <section class="py-16 sm:py-24 bg-white">
    <div class="max-w-4xl mx-auto px-6">
      <p class="text-xs font-bold tracking-widest uppercase text-mist mb-3 text-center">
        Як це працює
      </p>
      <div class="grid sm:grid-cols-3 gap-8 mt-8">
        <div v-for="step in steps" :key="step.n" class="text-center sm:text-left">
          <span class="text-3xl font-bold text-cat-noun/40">{{ step.n }}</span>
          <div class="mt-3 w-11 h-11 rounded-full bg-paper flex items-center justify-center mx-auto sm:mx-0">
            <MdiIcon :path="step.icon" :size="22" />
          </div>
          <h3 class="mt-4 font-bold text-lg">{{ step.title }}</h3>
          <p class="mt-2 text-mist text-sm leading-relaxed">{{ step.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
