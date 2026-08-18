<script setup lang="ts">
import { onMounted } from "vue";
import { mdiCellphoneArrowDown, mdiGithub } from "@mdi/js";
import MdiIcon from "./MdiIcon.vue";
import AppMockup from "./AppMockup.vue";
import { useLatestRelease } from "../composables/useLatestRelease";

const { version, apkUrl, releaseUrl, load, REPO_URL } = useLatestRelease();
onMounted(load);
</script>

<template>
  <section class="pt-14 pb-20 sm:pt-20 sm:pb-28">
    <div class="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 gap-12 items-center">
      <div class="text-center sm:text-left min-w-0">
        <h1 class="text-5xl sm:text-6xl font-bold tracking-tight">Розкажи</h1>
        <p class="mt-4 text-lg sm:text-xl text-mist max-w-md mx-auto sm:mx-0">
          Застосунок для дітей, яким важко говорити словами. Картка — це
          слово. Дотик — це голос.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
          <a
            :href="apkUrl ?? releaseUrl"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-bloom text-label-light font-bold text-base px-7 py-4 min-h-13"
          >
            <MdiIcon :path="mdiCellphoneArrowDown" :size="20" />
            Завантажити {{ version ? `v${version}` : "APK" }}
          </a>
          <a
            :href="REPO_URL"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-white border-2 border-ink/10 text-ink font-bold text-base px-7 py-4 min-h-13"
          >
            <MdiIcon :path="mdiGithub" :size="20" />
            GitHub
          </a>
        </div>
        <p class="mt-3 text-xs text-mist">
          Безкоштовно, з відкритим кодом (MIT). Без Google Play — інструкція встановлення нижче.
        </p>
      </div>

      <AppMockup class="min-w-0" />
    </div>
  </section>
</template>
