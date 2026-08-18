<script setup lang="ts">
defineProps<{
  path: string;
  size?: number;
}>();
</script>

<template>
  <svg
    class="inline-block shrink-0"
    :width="size ?? 20"
    :height="size ?? 20"
    viewBox="0 0 24 24"
  >
    <path :d="path" fill="currentColor" />
  </svg>
</template>
