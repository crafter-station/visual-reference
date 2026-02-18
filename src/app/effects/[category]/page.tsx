import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <main className="mx-auto max-w-[1400px] px-6 py-12">
      <div className="mb-8 flex items-center gap-2 border-b border-white/[0.06] pb-6">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <Link
          href="/effects"
          className="font-mono text-[11px] text-white/30 transition-colors hover:text-white/60"
        >
          effects
        </Link>
        <span className="font-mono text-[11px] text-white/15">/</span>
        <span className="font-mono text-[11px] text-white/50">{label}</span>
        <span className="ml-auto font-mono text-[10px] text-white/20">
          {effects.length} effects
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {effects.map(([slug, { effectName, motifSlugs }]) => (
          <div
            key={slug}
            className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-medium text-white/90">{effectName}</p>
              <span className="font-mono text-[10px] text-white/25">
                {motifSlugs.length} references
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {motifSlugs.map((motifSlug) => {
                const motif = motifs.find((m) => m.slug === motifSlug);
                if (!motif) return null;
                return (
                  <Link
                    key={motifSlug}
                    href={`/motifs/${motifSlug}`}
                    className="group relative overflow-hidden rounded-sm border border-white/[0.06] transition-all hover:border-white/[0.14]"
                  >
                    {motif.screenshots.desktop ? (
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={motif.screenshots.desktop}
                          alt={motif.name}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                          <p className="truncate font-mono text-[10px] text-white/70">{motif.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-white/[0.03]">
                        <span className="font-mono text-[10px] text-white/20">{motif.name}</span>
                      </div>
                    )}
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
