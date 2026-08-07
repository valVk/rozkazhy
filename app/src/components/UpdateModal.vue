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
      <div class="sheet-header">
        <h2>Доступна нова версія</h2>
        <button class="sheet-close" @click="emit('close')">
          <MdiIcon :path="mdiClose" :size="22" />
        </button>
      </div>
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
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.sheet-header h2 {
  margin: 0;
}
.sheet-close {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  color: var(--mist);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.body {
  color: var(--ink);
  font-size: 15px;
  line-height: 1.6;
}
</style>
