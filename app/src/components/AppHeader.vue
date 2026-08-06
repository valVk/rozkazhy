<script setup lang="ts">
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
    <h1>👋 Розкажи</h1>
    <div class="header-actions">
      <button
        id="sequencesBtn"
        aria-label="Збережені послідовності"
        @click="emit('openSequences')"
      >
        ⭐
      </button>
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
        ⚙️
      </button>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--pink);
  color: white;
  flex-shrink: 0;
}
header h1 {
  font-size: 20px;
  margin: 0;
  font-weight: 800;
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
</style>
