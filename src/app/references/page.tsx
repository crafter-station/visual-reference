import { getAllReferences } from "@/lib/references";
import { EFFECT_CATEGORY_LABELS } from "@/lib/taxonomy";
import type { EffectCategory } from "@/lib/types";
import { ReferenceCard } from "@/components/reference-card";
import { CategoryFilter } from "@/components/category-filter";

interface ReferencesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ReferencesPage({ searchParams }: ReferencesPageProps) {
  const params = await searchParams;
  const activeCategory = params.category as EffectCategory | undefined;
  const allReferences = getAllReferences();

  const filtered = activeCategory
    ? allReferences.filter((m) => m.effects.some((t) => t.category === activeCategory))
    : allReferences;

  const categories = Object.keys(EFFECT_CATEGORY_LABELS) as EffectCategory[];

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-12">
      <div className="mb-8 flex items-end justify-between border-b border-white/[0.06] pb-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">
            Browse
          </h1>
          <p className="mt-1 font-mono text-xs text-white/40">
            {filtered.length} of {allReferences.length} visual systems
          </p>
        </div>
      </div>

      <CategoryFilter categories={categories} activeCategory={activeCategory} />

      <div className="mt-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((ref) => (
              <ReferenceCard key={ref.slug} reference={ref} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02]">
            <p className="font-mono text-xs text-white/30">
              No references in this category yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
