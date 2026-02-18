import Link from "next/link";
import { getAllEffectCategories, getAllMotifs } from "@/lib/motifs";
import { MOTIF_CATEGORY_LABELS, MOTIF_CATEGORY_COLORS } from "@/lib/taxonomy";
import type { MotifCategory } from "@/lib/types";

export default function EffectsPage() {
  const categories = getAllEffectCategories();
  const motifs = getAllMotifs();

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-12">
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <h1 className="font-display text-3xl tracking-tight">Effects</h1>
        <p className="mt-1 font-mono text-xs text-white/40">
          {categories.length} categories across {motifs.length} visual systems
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(({ category, count }) => {
          const label = MOTIF_CATEGORY_LABELS[category as MotifCategory];
          const color = MOTIF_CATEGORY_COLORS[category as MotifCategory];
          const effectNames = motifs
            .flatMap((m) => m.motifs.filter((t) => t.category === category))
            .map((t) => t.name)
            .filter((name, i, arr) => arr.indexOf(name) === i)
            .slice(0, 4);

          return (
            <Link
              key={category}
              href={`/effects/${category}`}
              className="group flex flex-col gap-3 rounded-md border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.14]"
            >
              <div className="flex items-center justify-between">
                <div
                  className="h-1 w-8 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono text-[10px] text-white/25">
                  {count}
                </span>
              </div>
              <p className="text-[13px] font-medium text-white/90">{label}</p>
              {effectNames.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {effectNames.map((name) => (
                    <span
                      key={name}
                      className="rounded-sm bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/35"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
