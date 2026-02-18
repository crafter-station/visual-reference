import { getAllMotifs } from "@/lib/motifs";
import { MOTIF_CATEGORY_LABELS } from "@/lib/taxonomy";
import type { MotifCategory } from "@/lib/types";
import { MotifCard } from "@/components/motif-card";
import { CategoryFilter } from "@/components/category-filter";

interface MotifsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function MotifsPage({ searchParams }: MotifsPageProps) {
  const params = await searchParams;
  const activeCategory = params.category as MotifCategory | undefined;
  const allMotifs = getAllMotifs();

  const filtered = activeCategory
    ? allMotifs.filter((m) => m.motifs.some((t) => t.category === activeCategory))
    : allMotifs;

  const categories = Object.keys(MOTIF_CATEGORY_LABELS) as MotifCategory[];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Browse Motifs
        </h1>
        <p className="mt-2 text-sm text-white/40">
          {allMotifs.length} motifs collected
        </p>
      </div>

      <CategoryFilter categories={categories} activeCategory={activeCategory} />

      <div className="mt-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((motif) => (
              <MotifCard key={motif.slug} motif={motif} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <p className="font-mono text-sm text-white/30">
              No motifs in this category yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
