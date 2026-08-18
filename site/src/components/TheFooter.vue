<script setup lang="ts">
import { useLatestRelease } from "../composables/useLatestRelease";

const { REPO_URL } = useLatestRelease();
const posterUrl = `${import.meta.env.BASE_URL}rozkazhy-poster.pdf`;
</script>

<template>
  <footer class="py-10 border-t border-ink/5">
    <div class="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-mist">
      <span>Розкажи — MIT License</span>
      <div class="flex gap-5">
        <a :href="posterUrl" class="font-bold text-ink hover:underline">Плакат (PDF)</a>
        <a :href="REPO_URL" class="font-bold text-ink hover:underline">GitHub</a>
      </div>
    </div>
  </footer>
</template>
