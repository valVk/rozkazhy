<script setup lang="ts">
import { mdiContentSave, mdiPlay, mdiPause, mdiTrashCan } from "@mdi/js";
import MdiIcon from "./shared/MdiIcon.vue";

defineProps<{
  disabled: boolean;
  compact: boolean;
  isPlaying: boolean;
}>();
const emit = defineEmits<{
  (e: "save"): void;
  (e: "play"): void;
  (e: "pause"): void;
  (e: "clear"): void;
}>();
</script>

<template>
  <div class="playbar" :class="{ compact }">
    <button
      class="side-btn save-btn"
      :disabled="disabled"
      title="Зберегти послідовність"
      @click="emit('save')"
    >
      <MdiIcon :path="mdiContentSave" :size="20" />
    </button>
    <button
      class="play-btn"
      :disabled="disabled"
      :title="isPlaying ? 'Пауза' : 'Відтворити'"
      @click="isPlaying ? emit('pause') : emit('play')"
    >
      <MdiIcon :path="isPlaying ? mdiPause : mdiPlay" :size="32" />
    </button>
    <button
      class="side-btn clear-btn"
      :disabled="disabled"
      title="Очистити"
      @click="emit('clear')"
    >
      <MdiIcon :path="mdiTrashCan" :size="20" />
    </button>
  </div>
</template>

<style scoped>
.playbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  transition: padding 0.25s ease;
}
.playbar.compact {
  padding: 4px 16px;
}

.play-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: var(--moss);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(43, 42, 51, 0.14);
  cursor: pointer;
  transition:
    width 0.25s ease,
    height 0.25s ease;
}
.play-btn :deep(svg) {
  transition:
    width 0.25s ease,
    height 0.25s ease;
}
.playbar.compact .play-btn {
  width: 34px;
  height: 34px;
  box-shadow: 0 1px 3px rgba(43, 42, 51, 0.12);
}
.playbar.compact .play-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

.side-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    width 0.25s ease,
    height 0.25s ease;
}
.side-btn :deep(svg) {
  transition:
    width 0.25s ease,
    height 0.25s ease;
}
.playbar.compact .side-btn {
  width: 30px;
  height: 30px;
}
.playbar.compact .side-btn :deep(svg) {
  width: 14px;
  height: 14px;
}
.save-btn {
  background: var(--sky);
}
.clear-btn {
  background: var(--signal);
}
button:disabled {
  opacity: 0.35;
}
</style>
