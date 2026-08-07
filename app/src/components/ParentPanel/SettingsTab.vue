<script setup lang="ts">
import { onMounted, ref } from "vue";
import { mdiAlertCircle, mdiContentSave } from "@mdi/js";
import { useSequences } from "../../composables/useSequences";
import { useAppStore } from "../../stores/appStore";
import { useUpdateCheck } from "../../composables/useUpdateCheck";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  PRESET_SWATCHES,
  useCardCategories,
} from "../../composables/useCardCategories";
import MdiIcon from "../shared/MdiIcon.vue";
import UpdateModal from "../UpdateModal.vue";

defineProps<{ updateAvailable: boolean }>();

const { getFavoriteThreshold, setFavoriteThreshold } = useSequences();
const store = useAppStore();
const { latestVersion } = useUpdateCheck();
const {
  coloringEnabled,
  categoryColors,
  setColoringEnabled,
  setCategoryColor,
  resetCategoryColors,
} = useCardCategories();

const threshold = ref(5);
const updateModalOpen = ref(false);

onMounted(async () => {
  threshold.value = await getFavoriteThreshold();
});

async function onSave() {
  const n = Math.max(1, Math.floor(threshold.value));
  await setFavoriteThreshold(n);
  store.showToast("Налаштування збережено");
}

async function onToggleColoring() {
  await setColoringEnabled(!coloringEnabled.value);
}

async function onPickSwatch(category: (typeof CATEGORY_ORDER)[number], hex: string) {
  await setCategoryColor(category, hex);
}

async function onResetColors() {
  await resetCategoryColors();
  store.showToast("Кольори скинуто до типових");
}
</script>

<template>
  <div>
    <button
      v-if="updateAvailable"
      class="update-banner"
      @click="updateModalOpen = true"
    >
      <MdiIcon :path="mdiAlertCircle" :size="20" />
      <span>Доступна нова версія {{ latestVersion }} — натисніть, щоб оновити</span>
    </button>

    <label class="field-label">
      Автоматично позначати послідовність улюбленою після N відтворень
    </label>
    <input type="number" min="1" v-model.number="threshold" />
    <button class="btn btn-primary" @click="onSave">
      <MdiIcon :path="mdiContentSave" :size="18" />
      Зберегти
    </button>

    <h3>Кольорове кодування карток за типом слова</h3>
    <p class="hint">
      Позначає картки кольором залежно від типу слова (людина, дія, предмет
      тощо) — за системою, яку часто використовують логопеди. Підходить не
      всім дітям, тому вимкнено за замовчуванням.
    </p>
    <button
      class="btn btn-secondary toggle-btn"
      :class="{ active: coloringEnabled }"
      @click="onToggleColoring"
    >
      {{ coloringEnabled ? "Увімкнено" : "Вимкнено" }}
    </button>

    <template v-if="coloringEnabled">
      <div v-for="cat in CATEGORY_ORDER" :key="cat" class="category-row">
        <span class="category-name">{{ CATEGORY_LABELS[cat] }}</span>
        <div class="swatches">
          <button
            v-for="hex in PRESET_SWATCHES"
            :key="hex"
            type="button"
            class="swatch"
            :class="{ active: categoryColors[cat] === hex }"
            :style="{ background: hex }"
            :aria-label="hex"
            @click="onPickSwatch(cat, hex)"
          />
        </div>
      </div>
      <button class="btn btn-secondary" style="margin-top: 12px" @click="onResetColors">
        Скинути кольори до типових
      </button>
    </template>

    <UpdateModal v-if="updateModalOpen" @close="updateModalOpen = false" />
  </div>
</template>

<style scoped>
.update-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 12px 14px;
  margin-bottom: 16px;
  border: none;
  border-radius: 14px;
  background: var(--signal);
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}
.hint {
  color: var(--mist);
  font-size: 14px;
  margin: 0 0 12px;
}
.toggle-btn {
  width: auto;
}
.toggle-btn.active {
  background: var(--moss);
  color: white;
  border-color: var(--moss);
}
.category-row {
  margin-top: 14px;
}
.category-name {
  display: block;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 6px;
}
.swatches {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
}
.swatch.active {
  border-color: var(--ink);
}
</style>
