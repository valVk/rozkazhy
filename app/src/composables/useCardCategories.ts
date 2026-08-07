import { ref } from "vue";
import { Preferences } from "@capacitor/preferences";
import type { CardCategory } from "../types/card";

const ENABLED_KEY = "category_coloring_enabled";
const COLORS_KEY = "category_colors";

export const CATEGORY_ORDER: CardCategory[] = [
  "person",
  "verb",
  "noun",
  "descriptor",
  "social",
];

export const CATEGORY_LABELS: Record<CardCategory, string> = {
  person: "Людина",
  verb: "Дія",
  noun: "Предмет",
  descriptor: "Ознака",
  social: "Соціальна фраза",
};

// Fitzgerald-key-inspired defaults (person/verb/noun/descriptor/social),
// picked distinct from the app's own UI-action colors so a category tag
// never gets confused with "this is currently playing" or "primary button".
export const DEFAULT_CATEGORY_COLORS: Record<CardCategory, string> = {
  person: "#E0A526",
  verb: "#4F8B4A",
  noun: "#D97B3D",
  descriptor: "#3D7EA6",
  social: "#C34B6B",
};

// Curated preset swatches offered when a parent customizes a category's
// color — deliberately not a free-form color input, to keep every choice
// legible and on-brand rather than risking illegible/clashing picks.
export const PRESET_SWATCHES = [
  "#E0A526",
  "#4F8B4A",
  "#D97B3D",
  "#3D7EA6",
  "#C34B6B",
  "#8A63A8",
  "#4AA394",
  "#B0563C",
];

const coloringEnabled = ref(false);
const categoryColors = ref<Record<CardCategory, string>>({
  ...DEFAULT_CATEGORY_COLORS,
});

let loaded = false;

export function useCardCategories() {
  async function load(): Promise<void> {
    if (loaded) return;
    loaded = true;
    const [enabledRes, colorsRes] = await Promise.all([
      Preferences.get({ key: ENABLED_KEY }),
      Preferences.get({ key: COLORS_KEY }),
    ]);
    coloringEnabled.value = enabledRes.value === "1";
    if (colorsRes.value) {
      try {
        const stored = JSON.parse(colorsRes.value) as Partial<
          Record<CardCategory, string>
        >;
        categoryColors.value = { ...DEFAULT_CATEGORY_COLORS, ...stored };
      } catch {
        categoryColors.value = { ...DEFAULT_CATEGORY_COLORS };
      }
    }
  }

  async function setColoringEnabled(value: boolean): Promise<void> {
    coloringEnabled.value = value;
    await Preferences.set({ key: ENABLED_KEY, value: value ? "1" : "0" });
  }

  async function setCategoryColor(
    category: CardCategory,
    hex: string,
  ): Promise<void> {
    categoryColors.value = { ...categoryColors.value, [category]: hex };
    await Preferences.set({
      key: COLORS_KEY,
      value: JSON.stringify(categoryColors.value),
    });
  }

  async function resetCategoryColors(): Promise<void> {
    categoryColors.value = { ...DEFAULT_CATEGORY_COLORS };
    await Preferences.remove({ key: COLORS_KEY });
  }

  return {
    coloringEnabled,
    categoryColors,
    load,
    setColoringEnabled,
    setCategoryColor,
    resetCategoryColors,
  };
}
