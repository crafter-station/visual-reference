import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllEffectCategories, getAllMotifs } from "@/lib/motifs";
import { MOTIF_CATEGORY_LABELS, MOTIF_CATEGORY_COLORS } from "@/lib/taxonomy";
import type { MotifCategory } from "@/lib/types";

interface EffectCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllEffectCategories().map(({ category }) => ({ category }));
}

export default async function EffectCategoryPage({ params }: EffectCategoryPageProps) {
  const { category } = await params;
  const motifs = getAllMotifs();

  const label = MOTIF_CATEGORY_LABELS[category as MotifCategory];
  if (!label) {
    notFound();
  }

  const color = MOTIF_CATEGORY_COLORS[category as MotifCategory];

  const effectsMap = new Map<string, { effectName: string; motifSlugs: string[] }>();
  for (const motif of motifs) {
    for (const tag of motif.motifs) {
      if (tag.category !== category) continue;
      const entry = effectsMap.get(tag.slug) ?? { effectName: tag.name, motifSlugs: [] };
      entry.motifSlugs.push(motif.slug);
      effectsMap.set(tag.slug, entry);
    }
  }

  const effects = Array.from(effectsMap.entries()).sort((a, b) =>
    b[1].motifSlugs.length - a[1].motifSlugs.length
  );

  if (effects.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-2 flex items-center gap-3">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <Link
          href="/effects"
          className="font-mono text-xs text-white/30 transition-colors hover:text-white/60"
        >
          Effects
        </Link>
        <span className="font-mono text-xs text-white/20">/</span>
        <span className="font-mono text-xs text-white/50">{label}</span>
      </div>

      <h1 className="mb-10 text-3xl font-bold tracking-tight">{label}</h1>

      <div className="flex flex-col gap-6">
        {effects.map(([slug, { effectName, motifSlugs }]) => (
          <div
            key={slug}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/90">{effectName}</p>
                <p className="mt-0.5 font-mono text-xs text-white/30">
                  {motifSlugs.length} {motifSlugs.length === 1 ? "motif" : "motifs"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {motifSlugs.map((motifSlug) => {
                const motif = motifs.find((m) => m.slug === motifSlug);
                if (!motif) return null;
                return (
                  <Link
                    key={motifSlug}
                    href={`/motifs/${motifSlug}`}
                    className="rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-white/60 transition-colors hover:border-white/[0.16] hover:text-white/90"
                  >
                    {motif.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
