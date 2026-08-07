<script setup lang="ts">
import { onMounted, ref } from "vue";
import { mdiContentSave } from "@mdi/js";
import { useSequences } from "../../composables/useSequences";
import { useAppStore } from "../../stores/appStore";
import MdiIcon from "../shared/MdiIcon.vue";

const { getFavoriteThreshold, setFavoriteThreshold } = useSequences();
const store = useAppStore();

const threshold = ref(5);

onMounted(async () => {
  threshold.value = await getFavoriteThreshold();
});

async function onSave() {
  const n = Math.max(1, Math.floor(threshold.value));
  await setFavoriteThreshold(n);
  store.showToast("Налаштування збережено");
}
</script>

<template>
  <div>
    <label class="field-label">
      Автоматично позначати послідовність улюбленою після N відтворень
    </label>
    <input type="number" min="1" v-model.number="threshold" />
    <button class="btn btn-primary" @click="onSave">
      <MdiIcon :path="mdiContentSave" :size="18" />
      Зберегти
    </button>
  </div>
</template>
