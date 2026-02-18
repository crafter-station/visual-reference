import { getFeaturedMotifs } from "@/lib/motifs";
import { MotifCard } from "@/components/motif-card";

export default function HomePage() {
  const featured = getFeaturedMotifs();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <section className="pb-16 pt-8">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/40">
          visual-reference.crafter.run
        </p>
        <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
          Motif Library
        </h1>
        <p className="mt-3 font-mono text-base text-white/50">
          Named visual behaviors with psychological justification
        </p>
        <p className="mt-6 text-sm text-white/30">
          {featured.length > 0
            ? `${featured.length}+ motifs / 80+ effects / 6 categories`
            : "18 motifs / 80+ effects / 6 categories"}
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-white/40">
          Featured Motifs
        </h2>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((motif) => (
              <MotifCard key={motif.slug} motif={motif} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <p className="font-mono text-sm text-white/30">
              No motifs yet. Run the ingest script.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
