import { getAllReferences, getFeaturedReferences } from "@/lib/references";
import { ReferenceCard } from "@/components/reference-card";
import Link from "next/link";

export default function HomePage() {
  const featured = getFeaturedReferences();
  const total = getAllReferences().length;

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
            {total} visual systems / extracted tokens / psychological justification
          </p>
        </div>
        <Link
          href="/references"
          className="hidden font-mono text-xs text-white/30 transition-colors hover:text-white/60 sm:block"
        >
          Browse all &rarr;
        </Link>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            Latest References
          </h2>
          <span className="font-mono text-[10px] text-white/20">
            {featured.length} curated
          </span>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((ref) => (
              <ReferenceCard key={ref.slug} reference={ref} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02]">
            <p className="font-mono text-xs text-white/30">
              No references yet. Run the ingest script.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
