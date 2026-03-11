import { getAllReferencesSortedByDate, getFeaturedReferences } from "@/lib/references";
import { EFFECT_CATEGORY_LABELS } from "@/lib/taxonomy";
import type { EffectCategory } from "@/lib/types";
import { ReferenceCard } from "@/components/reference-card";
import { CategoryFilter } from "@/components/category-filter";

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const activeCategory = params.category as EffectCategory | undefined;

  const featured = getFeaturedReferences();
  const all = getAllReferencesSortedByDate();

  const browse = activeCategory
    ? all.filter((r) => r.effects.some((t) => t.category === activeCategory))
    : all;

  const categories = Object.keys(EFFECT_CATEGORY_LABELS) as EffectCategory[];

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-12">
      <section className="flex items-end justify-between border-b border-white/[0.06] pb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl tracking-tight md:text-5xl">
              Visual Reference
            </h1>
            <span className="rounded-sm bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-white/40">
              v0.2
            </span>
          </div>
          <p className="mt-2 font-mono text-sm text-white/40">
            {all.length} visual systems / extracted tokens / psychological justification
          </p>
        </div>
      </section>

      {!activeCategory && (
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
              Featured
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((ref) => (
              <ReferenceCard key={ref.slug} reference={ref} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            All References
          </h2>
          <span className="font-mono text-[10px] text-white/20">
            {browse.length} systems
          </span>
        </div>

        <CategoryFilter categories={categories} activeCategory={activeCategory} />

        <div className="mt-6">
          {browse.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {browse.map((ref) => (
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
      </section>
    </main>
  );
}
