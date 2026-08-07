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
  verb: "#43763F",
  noun: "#D97B3D",
  descriptor: "#377196",
  social: "#BA3E5F",
};

// Curated preset swatches offered when a parent customizes a category's
// color — deliberately not a free-form color input, to keep every choice
// legible and on-brand rather than risking illegible/clashing picks.
export const PRESET_SWATCHES = [
  "#E0A526",
  "#43763F",
  "#D97B3D",
  "#377196",
  "#BA3E5F",
  "#825AA1",
  "#4AA394",
  "#A55138",
];

// A light-on-color label reads as pure white text sitting on a photo-app
// card, which clashes with the paper/cream palette everywhere else — use
// the same warm, slightly-grey "gazette paper" tone instead.
export const LABEL_TEXT_LIGHT = "#F3EFE7";
export const LABEL_TEXT_DARK = "#2B2A33"; // matches --ink

// For each preset, whichever text color actually passes WCAG AA against
// it — some (bright gold/orange/teal) need the dark tone, others need the
// light "gazette paper" tone. Keyed by uppercase hex so it works for both
// defaults and custom swatches. Backgrounds were darkened just enough
// (relative to a plain "always white" scheme) to keep >=4.5:1 against the
// off-white light tone, not just against pure white.
export const SWATCH_TEXT_COLOR: Record<string, "light" | "dark"> = {
  "#E0A526": "dark",
  "#43763F": "light",
  "#D97B3D": "dark",
  "#377196": "light",
  "#BA3E5F": "light",
  "#825AA1": "light",
  "#4AA394": "dark",
  "#A55138": "light",
};

function relativeLuminance(hex: string): number {
  const toLinear = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(parseInt(hex.slice(1, 3), 16));
  const g = toLinear(parseInt(hex.slice(3, 5), 16));
  const b = toLinear(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Whichever of the two label tones actually passes WCAG AA against a given
// background color — a flat "colored = always light text" rule fails
// contrast for lighter presets like gold or teal. Shared by CardTile and
// the category filter chips so both stay in sync.
export function getContrastTextColor(hex: string): string {
  const known = SWATCH_TEXT_COLOR[hex.toUpperCase()];
  if (known) return known === "light" ? LABEL_TEXT_LIGHT : LABEL_TEXT_DARK;
  const l = relativeLuminance(hex);
  const lightLuminance = relativeLuminance(LABEL_TEXT_LIGHT);
  const darkLuminance = relativeLuminance(LABEL_TEXT_DARK);
  const contrastLight = (lightLuminance + 0.05) / (l + 0.05);
  const contrastDark = (l + 0.05) / (darkLuminance + 0.05);
  return contrastLight >= contrastDark ? LABEL_TEXT_LIGHT : LABEL_TEXT_DARK;
}

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
