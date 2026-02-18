"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Image from "next/image";
import { getAllMotifs } from "@/lib/motifs";
import type { Motif } from "@/lib/types";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawSlugs = searchParams.get("motifs");
  const selectedSlugs = rawSlugs ? rawSlugs.split(",").filter(Boolean) : [];
  const allMotifs = getAllMotifs();

  const selectedMotifs = selectedSlugs
    .map((s) => allMotifs.find((m) => m.slug === s))
    .filter((m): m is Motif => m !== undefined);

  const [pendingSlugs, setPendingSlugs] = useState<string[]>(
    selectedSlugs.length > 0 ? selectedSlugs : []
  );

  function toggleMotif(slug: string) {
    setPendingSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  }

  function handleCompare() {
    router.push(`/compare?motifs=${pendingSlugs.join(",")}`);
  }

  if (selectedMotifs.length >= 2) {
    const allColors = selectedMotifs.map((m) => ({
      slug: m.slug,
      colors: { ...m.tokens.colors.background, ...m.tokens.colors.accent },
    }));

    const effectSlugs = selectedMotifs.map((m) => new Set(m.motifs.map((t) => t.slug)));
    const sharedEffects = selectedMotifs[0].motifs.filter((t) =>
      effectSlugs.every((set) => set.has(t.slug))
    );
    const uniqueEffectsPerMotif = selectedMotifs.map((m) =>
      m.motifs.filter((t) => !sharedEffects.some((s) => s.slug === t.slug))
    );

    const combinedColors = Array.from(
      new Map(
        allColors.flatMap(({ colors }) =>
          Object.entries(colors).map(([k, v]) => [v, k])
        )
      ).entries()
    ).map(([hex, name]) => ({ hex, name }));

    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Compare</h1>
          <button
            type="button"
            onClick={() => router.push("/compare")}
            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            New Selection
          </button>
        </div>

        <div className="mb-12 grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedMotifs.length}, 1fr)` }}>
          {selectedMotifs.map((m) => (
            <div key={m.slug} className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-white/90">{m.name}</p>
              {m.screenshots.desktop && (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-white/[0.06]">
                  <Image src={m.screenshots.desktop} alt={m.name} fill className="object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
            Color Palettes
          </h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedMotifs.length}, 1fr)` }}>
            {allColors.map(({ slug, colors }) => (
              <div key={slug} className="flex flex-col gap-2">
                {Object.entries(colors).map(([name, hex]) => (
                  <div key={name} className="flex items-center gap-2">
                    <div
                      className="h-5 w-5 shrink-0 rounded-sm border border-white/10"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="font-mono text-xs text-white/50">{hex}</span>
                    <span className="truncate text-xs text-white/30">{name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
            Typography
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="pb-2 pr-4 text-left font-mono text-xs text-white/30">Token</th>
                  {selectedMotifs.map((m) => (
                    <th key={m.slug} className="pb-2 pr-4 text-left font-mono text-xs text-white/30">
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs text-white/40">Display</td>
                  {selectedMotifs.map((m) => (
                    <td key={m.slug} className="py-2 pr-4 text-xs text-white/70">
                      {m.tokens.typography.families.display}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs text-white/40">Body</td>
                  {selectedMotifs.map((m) => (
                    <td key={m.slug} className="py-2 pr-4 text-xs text-white/70">
                      {m.tokens.typography.families.body}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs text-white/40">Mono</td>
                  {selectedMotifs.map((m) => (
                    <td key={m.slug} className="py-2 pr-4 text-xs text-white/70">
                      {m.tokens.typography.families.mono ?? "—"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {sharedEffects.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
              Shared Effects
            </h2>
            <div className="flex flex-wrap gap-2">
              {sharedEffects.map((t) => (
                <span
                  key={t.slug}
                  className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-white/60"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
            Unique Effects
          </h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedMotifs.length}, 1fr)` }}>
            {selectedMotifs.map((m, i) => (
              <div key={m.slug}>
                <p className="mb-2 text-xs font-medium text-white/50">{m.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueEffectsPerMotif[i].length > 0
                    ? uniqueEffectsPerMotif[i].map((t) => (
                        <span
                          key={t.slug}
                          className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-white/60"
                        >
                          {t.name}
                        </span>
                      ))
                    : <span className="text-xs text-white/20">None</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
            Combined Palette
          </h2>
          <div className="flex flex-wrap gap-2">
            {combinedColors.map(({ hex, name }) => (
              <div
                key={hex}
                title={`${name} — ${hex}`}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="h-8 w-8 rounded-md border border-white/10"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-mono text-[10px] text-white/30">{hex}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Compare</h1>
        <p className="mt-2 text-sm text-white/50">
          Select 2 or 3 motifs to compare side by side.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="font-mono text-xs text-white/30">
          {pendingSlugs.length} / 3 selected
        </p>
        <button
          type="button"
          disabled={pendingSlugs.length < 2}
          onClick={handleCompare}
          className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Compare Selected
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allMotifs.map((m) => {
          const isSelected = pendingSlugs.includes(m.slug);
          return (
            <button
              key={m.slug}
              type="button"
              onClick={() => toggleMotif(m.slug)}
              className={`flex flex-col gap-3 rounded-lg border p-4 text-left transition-colors ${
                isSelected
                  ? "border-white/30 bg-white/[0.06]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
              }`}
            >
              {m.screenshots.desktop && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image src={m.screenshots.desktop} alt={m.name} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white/90">{m.name}</p>
                <p className="mt-0.5 text-xs text-white/40">{m.style}</p>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-white/30">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}
