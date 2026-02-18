import type { Motif, Category, MotifCategory, PaletteMode } from "./types";
import motifData from "@/content/motifs/index.json";

const data = motifData as unknown as Motif[];

export function getAllMotifs(): Motif[] {
  return data;
}

export function getMotifBySlug(slug: string): Motif | undefined {
  return data.find((m) => m.slug === slug);
}

export function getMotifsByCategory(category: Category): Motif[] {
  return data.filter((m) => m.categories.includes(category));
}

export function getMotifsByMode(mode: PaletteMode): Motif[] {
  return data.filter((m) => m.mode === mode);
}

export function getMotifsByEffect(category: MotifCategory): Motif[] {
  return data.filter((m) => m.motifs.some((t) => t.category === category));
}

export function getFeaturedMotifs(count = 6): Motif[] {
  return [...data].sort((a, b) => b.engagement - a.engagement).slice(0, count);
}

export function getMotifSlugs(): string[] {
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
  category: MotifCategory;
  count: number;
}[] {
  const map = new Map<MotifCategory, number>();
  for (const m of data) {
    for (const t of m.motifs) {
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
  motifSlug: string;
}[] {
  const colors: { hex: string; name: string; motifSlug: string }[] = [];
  for (const m of data) {
    for (const [name, hex] of Object.entries(m.tokens.colors.accent)) {
      colors.push({ hex, name, motifSlug: m.slug });
    }
  }
  return colors;
}
