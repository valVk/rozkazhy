<script setup lang="ts">
import { mdiGithub } from "@mdi/js";
import MdiIcon from "./MdiIcon.vue";
import { useLatestRelease } from "../composables/useLatestRelease";

const { REPO_URL } = useLatestRelease();
</script>

<template>
  <header class="sticky top-0 z-10 bg-paper/90 backdrop-blur border-b border-ink/5">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <span class="font-bold text-lg">Розкажи</span>
      <a
        :href="REPO_URL"
        class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-ink/5"
        aria-label="GitHub"
      >
        <MdiIcon :path="mdiGithub" :size="20" />
      </a>
    </div>
  </header>
</template>
