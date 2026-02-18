import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllEffectCategories, getAllReferences } from "@/lib/references";
import { EFFECT_CATEGORY_LABELS, EFFECT_CATEGORY_COLORS } from "@/lib/taxonomy";
import type { EffectCategory } from "@/lib/types";

interface EffectCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllEffectCategories().map(({ category }) => ({ category }));
}

export default async function EffectCategoryPage({ params }: EffectCategoryPageProps) {
  const { category } = await params;
  const references = getAllReferences();

  const label = EFFECT_CATEGORY_LABELS[category as EffectCategory];
  if (!label) {
    notFound();
  }

  const color = EFFECT_CATEGORY_COLORS[category as EffectCategory];

  const effectsMap = new Map<string, { effectName: string; refSlugs: string[] }>();
  for (const ref of references) {
    for (const tag of ref.effects) {
      if (tag.category !== category) continue;
      const entry = effectsMap.get(tag.slug) ?? { effectName: tag.name, refSlugs: [] };
      entry.refSlugs.push(ref.slug);
      effectsMap.set(tag.slug, entry);
    }
  }

  const effects = Array.from(effectsMap.entries()).sort((a, b) =>
    b[1].refSlugs.length - a[1].refSlugs.length
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
        {effects.map(([slug, { effectName, refSlugs }]) => (
          <div
            key={slug}
            className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-medium text-white/90">{effectName}</p>
              <span className="font-mono text-[10px] text-white/25">
                {refSlugs.length} references
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {refSlugs.map((refSlug) => {
                const ref = references.find((m) => m.slug === refSlug);
                if (!ref) return null;
                return (
                  <Link
                    key={refSlug}
                    href={`/references/${refSlug}`}
                    className="group relative overflow-hidden rounded-sm border border-white/[0.06] transition-all hover:border-white/[0.14]"
                  >
                    {ref.screenshots.desktop ? (
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={ref.screenshots.desktop}
                          alt={ref.name}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                          <p className="truncate font-mono text-[10px] text-white/70">{ref.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-white/[0.03]">
                        <span className="font-mono text-[10px] text-white/20">{ref.name}</span>
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
