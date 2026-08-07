<script setup lang="ts">
import { mdiAlertCircle, mdiCog, mdiStar } from "@mdi/js";
import MdiIcon from "./shared/MdiIcon.vue";

defineProps<{ updateAvailable: boolean }>();

let pressTimer: ReturnType<typeof setTimeout> | null = null;

const emit = defineEmits<{
  (e: "openParent"): void;
  (e: "openSequences"): void;
}>();

function start(e: Event) {
  e.preventDefault();
  pressTimer = setTimeout(() => emit("openParent"), 700);
}
function cancel() {
  if (pressTimer) clearTimeout(pressTimer);
}
</script>

<template>
  <header>
    <h1>Розкажи</h1>
    <div class="header-actions">
      <button
        id="sequencesBtn"
        aria-label="Збережені послідовності"
        @click="emit('openSequences')"
      >
        <MdiIcon :path="mdiStar" :size="22" />
      </button>
      <div class="gear-wrap">
        <button
          id="gearBtn"
          aria-label="Налаштування (для дорослих)"
          @mousedown="start"
          @touchstart.passive="start"
          @contextmenu.prevent
          @mouseup="cancel"
          @mouseleave="cancel"
          @touchend="cancel"
          @touchcancel="cancel"
        >
          <MdiIcon :path="mdiCog" :size="22" />
        </button>
        <span v-if="updateAvailable" id="updateBadge" aria-hidden="true">
          <MdiIcon :path="mdiAlertCircle" :size="14" />
        </span>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(14px + env(safe-area-inset-top)) 16px 14px;
  background: var(--bloom);
  color: white;
  flex-shrink: 0;
}
header h1 {
  font-size: 22px;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.header-actions button {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
  cursor: pointer;
}
.gear-wrap {
  position: relative;
}
#updateBadge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--signal);
  color: white;
  border: 2px solid var(--bloom);
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
</style>
