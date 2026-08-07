<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppHeader from "./components/AppHeader.vue";
import SentenceStrip from "./components/SentenceStrip.vue";
import PlayBar from "./components/PlayBar.vue";
import CardGrid from "./components/CardGrid.vue";
import PinLockScreen from "./components/PinLockScreen.vue";
import SequencesPanel from "./components/SequencesPanel.vue";
import ParentPanel from "./components/ParentPanel/ParentPanel.vue";
import UpdateModal from "./components/UpdateModal.vue";
import ShToast from "./components/shared/Toast.vue";
import { useAppStore } from "./stores/appStore";
import { useCards } from "./composables/useCards";
import { useSequences } from "./composables/useSequences";
import { usePlaybackController } from "./composables/usePlaybackController";
import { useAudioPlayback } from "./composables/useAudioPlayback";
import { useUpdateCheck } from "./composables/useUpdateCheck";
import { useCardCategories } from "./composables/useCardCategories";
import type { Card } from "./types/card";

const store = useAppStore();
const { cards, refresh, incrementTapCount } = useCards();
const { saveCurrent } = useSequences();
const playback = usePlaybackController();
const { playCardAudio } = useAudioPlayback();
const { updateAvailable, checkForUpdate } = useUpdateCheck();
const { load: loadCardCategories } = useCardCategories();

const pinScreenVisible = ref(false);
const isCompact = ref(false);
const updateModalOpen = ref(false);

onMounted(refresh);
onMounted(checkForUpdate);
onMounted(loadCardCategories);

// If a card currently in the sentence gets deleted (e.g. via the parent
// panel) while it's mid-playback, the playback loop would keep running
// against a stale array — stop it rather than let it silently desync.
watch(cards, () => {
  if (!playback.isPlaying.value && !playback.isPaused.value) return;
  const stillValid = store.sentence.every((c) =>
    cards.value.some((existing) => existing.id === c.id),
  );
  if (!stillValid) {
    playback.stop();
  }
});

async function onCardTap(card: Card) {
  store.addToSentence(card);
  await playCardAudio(card);
  await incrementTapCount(card.id);
}

async function onPlaySentence() {
  await playback.play(store.sentence);
}

function onPauseSentence() {
  playback.pause();
}

function onClearSentence() {
  playback.stop();
  store.clearSentence();
}

function onSelectFrame(index: number) {
  playback.selectFrame(index);
}

async function onSaveSequence() {
  await saveCurrent(store.sentence);
  store.showToast("Послідовність збережена");
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
  await playback.play(replayCards);
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

function onOpenUpdate() {
  updateModalOpen.value = true;
}
</script>

<template>
  <div id="app">
    <AppHeader
      :update-available="updateAvailable"
      @open-parent="onOpenParent"
      @open-sequences="onOpenSequences"
      @open-update="onOpenUpdate"
    />
    <div class="composer">
      <SentenceStrip
        :cards="store.sentence"
        :compact="isCompact"
        :current-index="playback.currentIndex.value"
        :paused="playback.isPaused.value"
        :is-playing="playback.isPlaying.value"
        @select-frame="onSelectFrame"
      />
      <PlayBar
        :disabled="store.sentence.length === 0"
        :compact="isCompact"
        :is-playing="playback.isPlaying.value"
        @save="onSaveSequence"
        @play="onPlaySentence"
        @pause="onPauseSentence"
        @clear="onClearSentence"
      />
    </div>
    <CardGrid
      :cards="cards"
      @tap="onCardTap"
      @compact="(v) => (isCompact = v)"
    />

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
    <UpdateModal v-if="updateModalOpen" @close="updateModalOpen = false" />
    <ShToast />
  </div>
</template>

<style scoped>
/* SentenceStrip and PlayBar used to be two separately-bordered boxes with
   mismatched heights — visually unifying them into one panel (single
   background, single soft shadow) reads as one "sentence composer" instead
   of two stacked chrome elements. */
.composer {
  flex-shrink: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(43, 42, 51, 0.06);
  position: relative;
  z-index: 1;
}
</style>
