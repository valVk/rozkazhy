<script setup lang="ts">
import { mdiClose, mdiDownload } from "@mdi/js";
import { Browser } from "@capacitor/browser";
import { useUpdateCheck } from "../composables/useUpdateCheck";
import MdiIcon from "./shared/MdiIcon.vue";

const emit = defineEmits<{ (e: "close"): void }>();
const { latestVersion, latestApkUrl, latestReleaseUrl, currentVersion } =
  useUpdateCheck();

async function onDownload() {
  const url = latestApkUrl.value ?? latestReleaseUrl.value;
  if (!url) return;
  await Browser.open({ url });
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="sheet">
      <button class="sheet-close" @click="emit('close')">
        <MdiIcon :path="mdiClose" :size="22" />
      </button>
      <h2 class="title">Доступна нова версія</h2>
      <p class="body">
        Встановлена версія: {{ currentVersion }}<br />
        Нова версія: {{ latestVersion }}
      </p>
      <button class="btn btn-primary btn-block" @click="onDownload">
        <MdiIcon :path="mdiDownload" :size="18" />
        Завантажити оновлення
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 30, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 70;
}
.sheet {
  position: relative;
  background: var(--paper);
  width: 100%;
  max-width: 520px;
  border-radius: 26px 26px 0 0;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
}
.sheet-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 44px;
  height: 44px;
  background: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(43, 42, 51, 0.12);
  color: var(--mist);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  padding-right: 48px;
}
.body {
  color: var(--ink);
  font-size: 15px;
  line-height: 1.6;
}
</style>
