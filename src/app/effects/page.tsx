import Link from "next/link";
import { getAllEffectCategories, getAllMotifs } from "@/lib/motifs";
import { MOTIF_CATEGORY_LABELS, MOTIF_CATEGORY_COLORS } from "@/lib/taxonomy";
import type { MotifCategory } from "@/lib/types";

export default function EffectsPage() {
  const categories = getAllEffectCategories();
  const motifs = getAllMotifs();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Effects</h1>
        <p className="mt-2 text-sm text-white/50">
          Browse motifs grouped by visual effect category.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map(({ category, count }) => {
          const label = MOTIF_CATEGORY_LABELS[category as MotifCategory];
          const color = MOTIF_CATEGORY_COLORS[category as MotifCategory];
          const effectNames = motifs
            .flatMap((m) => m.motifs.filter((t) => t.category === category))
            .map((t) => t.name)
            .filter((name, i, arr) => arr.indexOf(name) === i)
            .slice(0, 3);

          return (
            <Link
              key={category}
              href={`/effects/${category}`}
              className="group flex flex-col gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div
                className="h-1 w-full rounded-full"
                style={{ backgroundColor: color }}
              />
              <div>
                <p className="text-sm font-medium text-white/90">{label}</p>
                <p className="mt-0.5 font-mono text-xs text-white/30">
                  {count} {count === 1 ? "motif" : "motifs"}
                </p>
              </div>
              {effectNames.length > 0 && (
                <ul className="space-y-1">
                  {effectNames.map((name) => (
                    <li key={name} className="text-xs text-white/50">
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
