<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppHeader from "./components/AppHeader.vue";
import SentenceStrip from "./components/SentenceStrip.vue";
import CardGrid from "./components/CardGrid.vue";
import PinLockScreen from "./components/PinLockScreen.vue";
import SequencesPanel from "./components/SequencesPanel.vue";
import ParentPanel from "./components/ParentPanel/ParentPanel.vue";
import ShToast from "./components/shared/Toast.vue";
import { useAppStore } from "./stores/appStore";
import { useCards } from "./composables/useCards";
import { useSentenceLog } from "./composables/useSentenceLog";
import { useSequences } from "./composables/useSequences";
import { useAudioPlayback } from "./composables/useAudioPlayback";
import type { Card } from "./types/card";

const store = useAppStore();
const { cards, refresh, incrementTapCount } = useCards();
const { logSentence } = useSentenceLog();
const { saveCurrent } = useSequences();
const { playCardAudio } = useAudioPlayback();

const pinScreenVisible = ref(false);

onMounted(refresh);

async function onCardTap(card: Card) {
  store.addToSentence(card);
  await playCardAudio(card);
  await incrementTapCount(card.id);
}

async function onPlaySentence() {
  for (const card of store.sentence) {
    await playCardAudio(card);
    await new Promise((r) => setTimeout(r, 150));
  }
  await logSentence(store.sentence);
}

function onClearSentence() {
  store.clearSentence();
}

async function onSaveSequence() {
  await saveCurrent(store.sentence);
  store.showToast("Послідовність збережена ✓");
}

function onOpenSequences() {
  store.sequencesPanelOpen = true;
}

async function onReplaySequence(cardIds: number[]) {
  const replayCards = cardIds
    .map((id) => cards.value.find((c) => c.id === id))
    .filter((c): c is Card => !!c);
  store.loadSentence(replayCards);
  store.sequencesPanelOpen = false;
  await onPlaySentence();
}

function onOpenParent() {
  pinScreenVisible.value = true;
}

function onPinUnlocked() {
  pinScreenVisible.value = false;
  store.openParentPanel();
}

function onPinCancel() {
  pinScreenVisible.value = false;
}
</script>

<template>
  <div id="app">
    <AppHeader @open-parent="onOpenParent" @open-sequences="onOpenSequences" />
    <SentenceStrip
      :cards="store.sentence"
      @play="onPlaySentence"
      @clear="onClearSentence"
      @save="onSaveSequence"
    />
    <CardGrid :cards="cards" @tap="onCardTap" />

    <PinLockScreen
      v-if="pinScreenVisible"
      @unlocked="onPinUnlocked"
      @cancel="onPinCancel"
    />
    <ParentPanel v-if="store.parentPanelOpen" @close="store.closeParentPanel" />
    <SequencesPanel
      v-if="store.sequencesPanelOpen"
      @close="store.sequencesPanelOpen = false"
      @replay="onReplaySequence"
    />
    <ShToast />
  </div>
</template>
