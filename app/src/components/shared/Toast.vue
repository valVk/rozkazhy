<script setup lang="ts">
import { useAppStore } from "../../stores/appStore";

const store = useAppStore();
</script>

<template>
  <div class="toast" :class="{ show: store.toastVisible }">
    {{ store.toastMessage }}
  </div>
</template>
