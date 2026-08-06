<script setup lang="ts">
import { ref } from "vue";
import AddCardTab from "./AddCardTab.vue";
import ManageCardsTab from "./ManageCardsTab.vue";
import DashboardTab from "./DashboardTab.vue";
import SettingsTab from "./SettingsTab.vue";
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
      <button class="sheet-close" @click="emit('close')">✕</button>
      <h2>Панель дорослого</h2>
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'add' }"
          @click="activeTab = 'add'; editingCard = null"
        >
          ➕ Додати
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'manage' }"
          @click="activeTab = 'manage'"
        >
          🗂 Картки
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'dashboard' }"
          @click="activeTab = 'dashboard'"
        >
          📊 Дашборд
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          ⚙️
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
  background: var(--cream);
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 26px 26px 0 0;
  padding: 20px;
}
.sheet-close {
  position: sticky;
  top: 0;
  float: right;
  background: none;
  border: none;
  font-size: 26px;
  color: var(--gray);
  cursor: pointer;
}
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.tab-btn {
  flex: 1;
  padding: 10px;
  border-radius: 14px;
  border: none;
  background: #fff;
  color: var(--dark);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
.tab-btn.active {
  background: var(--pink);
  color: white;
}
</style>
