import { resolveMediaUrl } from "./mediaUrl";
import type { Card } from "../types/card";

export function useAudioPlayback() {
  function speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "uk-UA";
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
