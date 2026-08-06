<script setup lang="ts">
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
      💾
    </button>
    <button
      class="play-btn"
      :disabled="disabled"
      :title="isPlaying ? 'Пауза' : 'Відтворити'"
      @click="isPlaying ? emit('pause') : emit('play')"
    >
      {{ isPlaying ? "⏸" : "▶" }}
    </button>
    <button
      class="side-btn clear-btn"
      :disabled="disabled"
      title="Очистити"
      @click="emit('clear')"
    >
      🗑
    </button>
  </div>
</template>

<style scoped>
.playbar {
  flex-shrink: 0;
  background: white;
  border-bottom: 3px solid var(--teal);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  transition: padding 0.25s ease;
}
.playbar.compact {
  padding: 4px 16px;
}

.play-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: #4caf80;
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition:
    width 0.25s ease,
    height 0.25s ease,
    font-size 0.25s ease;
}
.playbar.compact .play-btn {
  width: 38px;
  height: 38px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.side-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    width 0.25s ease,
    height 0.25s ease,
    font-size 0.25s ease;
}
.playbar.compact .side-btn {
  width: 30px;
  height: 30px;
  font-size: 13px;
}
.save-btn {
  background: var(--teal);
}
.clear-btn {
  background: var(--danger);
}
button:disabled {
  opacity: 0.35;
}
</style>
