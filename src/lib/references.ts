import type { VisualReference, Category, EffectCategory, PaletteMode } from "./types";
import referenceData from "@/content/references/index.json";

const data = referenceData as unknown as VisualReference[];

export function getAllReferences(): VisualReference[] {
  return data;
}

export function getReferenceBySlug(slug: string): VisualReference | undefined {
  return data.find((m) => m.slug === slug);
}

export function getReferencesByCategory(category: Category): VisualReference[] {
  return data.filter((m) => m.categories.includes(category));
}

export function getReferencesByMode(mode: PaletteMode): VisualReference[] {
  return data.filter((m) => m.mode === mode);
}

export function getReferencesByEffect(category: EffectCategory): VisualReference[] {
  return data.filter((m) => m.effects.some((t) => t.category === category));
}

const FEATURED_SLUGS = [
  "hunt-united-drone-company",
  "hunt-nexara",
  "hunt-blissful-team",
  "hunt-cassette-cat",
  "hunt-amp-dev",
  "hunt-cursor-directory",
  "hunt-big-architects",
  "hunt-maca-voice",
];

export function getFeaturedReferences(): VisualReference[] {
  return FEATURED_SLUGS
    .map((slug) => data.find((m) => m.slug === slug))
    .filter((m): m is VisualReference => m !== undefined);
}

export function getReferenceSlugs(): string[] {
  return data.map((m) => m.slug);
}

export function getAllCategories(): Category[] {
  const cats = new Set<Category>();
  for (const m of data) {
    for (const c of m.categories) cats.add(c);
  }
  return Array.from(cats);
}

export function getAllEffectCategories(): {
  category: EffectCategory;
  count: number;
}[] {
  const map = new Map<EffectCategory, number>();
  for (const m of data) {
    for (const t of m.effects) {
      map.set(t.category, (map.get(t.category) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllColors(): {
  hex: string;
  name: string;
  refSlug: string;
}[] {
  const colors: { hex: string; name: string; refSlug: string }[] = [];
  for (const m of data) {
    for (const [name, hex] of Object.entries(m.tokens.colors.accent)) {
      colors.push({ hex, name, refSlug: m.slug });
    }
  }
  return colors;
}
