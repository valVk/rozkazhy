import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { resolveMediaUrl } from "./mediaUrl";
import type { Card } from "../types/card";

const TTS_LANG = "uk-UA";

export function useAudioPlayback() {
  async function speak(text: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.speak({ text, lang: TTS_LANG, rate: 0.9 });
      } catch {
        // TTS engine unavailable or language not installed on device
      }
      return;
    }

    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = TTS_LANG;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
  }

  async function playCardAudio(card: Card): Promise<void> {
    const url = await resolveMediaUrl(card.audioPath);
    if (!url) {
      await speak(card.title);
      return;
    }
    await new Promise<void>((resolve) => {
      const audio = new Audio(url);
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }

  return { playCardAudio, speak };
}
