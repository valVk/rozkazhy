import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { resolveMediaUrl } from "./mediaUrl";
import type { Card } from "../types/card";

const TTS_LANG = "uk-UA";

let activeAudioEl: HTMLAudioElement | null = null;
let stopResolvers: Array<() => void> = [];

function waitForStop(): Promise<void> {
  return new Promise((resolve) => stopResolvers.push(resolve));
}

function stopPlayback(): void {
  if (activeAudioEl) {
    activeAudioEl.pause();
    activeAudioEl = null;
  }
  if (Capacitor.isNativePlatform()) {
    TextToSpeech.stop().catch(() => {});
  } else if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
  const pending = stopResolvers;
  stopResolvers = [];
  pending.forEach((resolve) => resolve());
}

export function useAudioPlayback() {
  async function speak(text: string): Promise<void> {
    const stopped = waitForStop();
    if (Capacitor.isNativePlatform()) {
      const spoken = (async () => {
        try {
          await TextToSpeech.speak({ text, lang: TTS_LANG, rate: 0.9 });
        } catch {
          // TTS engine unavailable or language not installed on device
        }
      })();
      await Promise.race([spoken, stopped]);
      return;
    }

    if (!("speechSynthesis" in window)) {
      return;
    }
    const spoken = new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = TTS_LANG;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
    await Promise.race([spoken, stopped]);
  }

  async function playCardAudio(card: Card): Promise<void> {
    const url = await resolveMediaUrl(card.audioPath);
    if (!url) {
      await speak(card.title);
      return;
    }
    const stopped = waitForStop();
    const played = new Promise<void>((resolve) => {
      const audio = new Audio(url);
      activeAudioEl = audio;
      const finish = () => {
        if (activeAudioEl === audio) activeAudioEl = null;
        resolve();
      };
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    });
    await Promise.race([played, stopped]);
  }

  return { playCardAudio, speak, stopPlayback };
}
