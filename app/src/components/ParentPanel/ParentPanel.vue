<script setup lang="ts">
import { ref } from "vue";
import { mdiChartBar, mdiClose, mdiCog, mdiFolder, mdiPlus } from "@mdi/js";
import AddCardTab from "./AddCardTab.vue";
import ManageCardsTab from "./ManageCardsTab.vue";
import DashboardTab from "./DashboardTab.vue";
import SettingsTab from "./SettingsTab.vue";
import MdiIcon from "../shared/MdiIcon.vue";
import type { Card } from "../../types/card";

const emit = defineEmits<{ (e: "close"): void }>();

const activeTab = ref<"add" | "manage" | "dashboard" | "settings">("add");
const editingCard = ref<Card | null>(null);

function startEdit(card: Card) {
  editingCard.value = card;
  activeTab.value = "add";
}

function onSaved() {
  editingCard.value = null;
  activeTab.value = "manage";
}
</script>

<template>
  <div class="overlay">
    <div class="sheet">
      <button class="sheet-close" @click="emit('close')">
        <MdiIcon :path="mdiClose" :size="22" />
      </button>
      <h2>Панель дорослого</h2>
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'add' }"
          @click="activeTab = 'add'; editingCard = null"
        >
          <MdiIcon :path="mdiPlus" :size="16" />
          Додати
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'manage' }"
          @click="activeTab = 'manage'"
        >
          <MdiIcon :path="mdiFolder" :size="16" />
          Картки
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'dashboard' }"
          @click="activeTab = 'dashboard'"
        >
          <MdiIcon :path="mdiChartBar" :size="16" />
          Дашборд
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          <MdiIcon :path="mdiCog" :size="16" />
        </button>
      </div>

      <AddCardTab
        v-if="activeTab === 'add'"
        :editing-card="editingCard"
        @saved="onSaved"
      />
      <ManageCardsTab v-else-if="activeTab === 'manage'" @edit="startEdit" />
      <DashboardTab v-else-if="activeTab === 'dashboard'" />
      <SettingsTab v-else-if="activeTab === 'settings'" />
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
  z-index: 50;
}
.sheet {
  background: var(--paper);
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 26px 26px 0 0;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
}
.sheet-close {
  position: sticky;
  top: 0;
  float: right;
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
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.tab-btn {
  flex: 1;
  min-height: 44px;
  padding: 10px;
  border-radius: 14px;
  border: none;
  background: #fff;
  color: var(--ink);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.tab-btn.active {
  background: var(--bloom);
  color: white;
}
</style>
