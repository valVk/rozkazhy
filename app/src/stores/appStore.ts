import { defineStore } from "pinia";
import type { Card } from "../types/card";

export const useAppStore = defineStore("app", {
  state: () => ({
    sentence: [] as Card[],
    parentPanelOpen: false,
    sequencesPanelOpen: false,
    activeTab: "add" as "add" | "manage" | "dashboard" | "settings",
    toastMessage: "",
    toastVisible: false,
  }),
  actions: {
    addToSentence(card: Card) {
      this.sentence.push(card);
    },
    clearSentence() {
      this.sentence = [];
    },
    loadSentence(cards: Card[]) {
      this.sentence = cards;
    },
    openParentPanel() {
      this.parentPanelOpen = true;
    },
    closeParentPanel() {
      this.parentPanelOpen = false;
    },
    showToast(message: string) {
      this.toastMessage = message;
      this.toastVisible = true;
      setTimeout(() => {
        this.toastVisible = false;
      }, 2000);
    },
  },
});
