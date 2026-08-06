import { ref } from "vue";
import type { Card } from "../types/card";
import { useAudioPlayback } from "./useAudioPlayback";
import { useSentenceLog } from "./useSentenceLog";

const currentIndex = ref<number | null>(null);
const isPlaying = ref(false);
const isPaused = ref(false);

let token = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function usePlaybackController() {
  const { playCardAudio, stopPlayback } = useAudioPlayback();
  const { logSentence } = useSentenceLog();

  async function play(cards: Card[], startIndex?: number): Promise<void> {
    if (cards.length === 0) return;
    const from =
      startIndex ??
      (isPaused.value && currentIndex.value !== null
        ? currentIndex.value
        : 0);

    const myToken = ++token;
    isPlaying.value = true;
    isPaused.value = false;

    for (let i = from; i < cards.length; i++) {
      if (myToken !== token) return;
      currentIndex.value = i;
      await playCardAudio(cards[i]);
      if (myToken !== token) return;
      await sleep(150);
    }

    if (myToken === token) {
      isPlaying.value = false;
      currentIndex.value = null;
      await logSentence(cards);
    }
  }

  function pause(): void {
    if (!isPlaying.value) return;
    token++;
    stopPlayback();
    isPlaying.value = false;
    isPaused.value = true;
  }

  function stop(): void {
    token++;
    stopPlayback();
    isPlaying.value = false;
    isPaused.value = false;
    currentIndex.value = null;
  }

  function selectFrame(index: number): void {
    if (!isPaused.value) return;
    currentIndex.value = index;
  }

  return { currentIndex, isPlaying, isPaused, play, pause, stop, selectFrame };
}
