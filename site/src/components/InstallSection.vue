<script setup lang="ts">
import { onMounted } from "vue";
import { mdiCellphoneArrowDown } from "@mdi/js";
import MdiIcon from "./MdiIcon.vue";
import { useLatestRelease } from "../composables/useLatestRelease";

const { version, apkUrl, releaseUrl, load } = useLatestRelease();
onMounted(load);

const steps = [
  "Завантажте APK-файл і відкрийте його — Android попередить про \"невідоме джерело\".",
  "Натисніть Налаштування в цьому діалозі й дозвольте встановлення з джерела, яким ви відкрили файл.",
  "Поверніться й відкрийте APK ще раз — з'явиться звичайний діалог встановлення.",
];
</script>

<template>
  <section id="install" class="py-16 sm:py-24">
    <div class="max-w-2xl mx-auto px-6 text-center">
      <p class="text-xs font-bold tracking-widest uppercase text-mist mb-3">
        Встановлення
      </p>
      <h2 class="text-3xl font-bold">Застосунок не в Google Play</h2>
      <p class="mt-4 text-mist leading-relaxed">
        APK збирається автоматично при кожному релізі й підписаний власним
        ключем — тому Android спершу попросить окремий дозвіл на встановлення.
        Це очікувано і безпечно, якщо файл завантажено з офіційних релізів
        цього репозиторію.
      </p>

      <a
        :href="apkUrl ?? releaseUrl"
        class="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-bloom text-label-light font-bold text-base px-7 py-4 min-h-13"
      >
        <MdiIcon :path="mdiCellphoneArrowDown" :size="20" />
        Завантажити {{ version ? `v${version}` : "APK" }}
      </a>

      <ol class="mt-10 text-left space-y-4 max-w-md mx-auto">
        <li v-for="(step, i) in steps" :key="i" class="flex gap-3">
          <span class="shrink-0 w-7 h-7 rounded-full bg-paper flex items-center justify-center font-bold text-xs">
            {{ i + 1 }}
          </span>
          <span class="text-sm leading-relaxed pt-0.5">{{ step }}</span>
        </li>
      </ol>

      <a href="#instructions" class="mt-6 inline-block text-sm text-sky font-bold underline">
        Повна інструкція ↓
      </a>
    </div>
  </section>
</template>
