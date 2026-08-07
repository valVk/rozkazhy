<script setup lang="ts">
defineProps<{
  path: string;
  size?: number;
}>();
</script>

<template>
  <svg
    class="mdi-icon"
    :width="size ?? 20"
    :height="size ?? 20"
    viewBox="0 0 24 24"
  >
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<style scoped>
.mdi-icon {
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}
</style>
