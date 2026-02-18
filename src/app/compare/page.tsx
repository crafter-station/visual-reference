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

    return (
      <main className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="mb-8 flex items-center justify-between border-b border-white/[0.06] pb-6">
          <div>
            <h1 className="font-display text-3xl tracking-tight">Compare</h1>
            <p className="mt-1 font-mono text-xs text-white/40">
              {selectedMotifs.length} systems side by side
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/compare")}
            className="rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/70"
          >
            Reset
          </button>
        </div>

        <div
          className="mb-10 grid gap-3"
          style={{ gridTemplateColumns: `repeat(${selectedMotifs.length}, 1fr)` }}
        >
          {selectedMotifs.map((m) => (
            <div key={m.slug} className="flex flex-col gap-2">
              <p className="text-[13px] font-medium text-white/90">{m.name}</p>
              <p className="font-mono text-[10px] text-white/30">{m.style}</p>
              {m.screenshots.desktop && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/[0.06]">
                  <Image src={m.screenshots.desktop} alt={m.name} fill className="object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8">
          <section>
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
              Color Palettes
            </h2>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${selectedMotifs.length}, 1fr)` }}
            >
              {allColors.map(({ slug, colors }) => (
                <div key={slug} className="flex flex-col gap-1.5">
                  {Object.entries(colors).map(([name, hex]) => (
                    <div key={name} className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 shrink-0 rounded-sm border border-white/[0.08]"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="font-mono text-[10px] text-white/40">{hex}</span>
                      <span className="truncate font-mono text-[10px] text-white/20">{name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
              Typography
            </h2>
            <div className="overflow-x-auto rounded-md border border-white/[0.06]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-3 py-2 text-left font-mono text-[10px] font-normal text-white/30">Token</th>
                    {selectedMotifs.map((m) => (
                      <th key={m.slug} className="px-3 py-2 text-left font-mono text-[10px] font-normal text-white/30">
                        {m.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {(["display", "body", "mono"] as const).map((key) => (
                    <tr key={key}>
                      <td className="px-3 py-2 font-mono text-[10px] text-white/40">{key}</td>
                      {selectedMotifs.map((m) => (
                        <td key={m.slug} className="px-3 py-2 text-xs text-white/60">
                          {key === "mono"
                            ? m.tokens.typography.families.mono ?? "—"
                            : m.tokens.typography.families[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {sharedEffects.length > 0 && (
            <section>
              <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
                Shared Effects
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {sharedEffects.map((t) => (
                  <span
                    key={t.slug}
                    className="rounded-sm bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-white/50"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
              Unique Effects
            </h2>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${selectedMotifs.length}, 1fr)` }}
            >
              {selectedMotifs.map((m, i) => (
                <div key={m.slug}>
                  <p className="mb-2 font-mono text-[10px] text-white/30">{m.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {uniqueEffectsPerMotif[i].length > 0
                      ? uniqueEffectsPerMotif[i].map((t) => (
                          <span
                            key={t.slug}
                            className="rounded-sm bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-white/50"
                          >
                            {t.name}
                          </span>
                        ))
                      : <span className="font-mono text-[10px] text-white/15">None</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-12">
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <h1 className="font-display text-3xl tracking-tight">Compare</h1>
        <p className="mt-1 font-mono text-xs text-white/40">
          Select 2-3 visual systems to compare side by side.
        </p>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <p className="font-mono text-[11px] text-white/25">
          {pendingSlugs.length} / 3 selected
        </p>
        <button
          type="button"
          disabled={pendingSlugs.length < 2}
          onClick={handleCompare}
          className="rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-25"
        >
          Compare Selected
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {allMotifs.map((m) => {
          const isSelected = pendingSlugs.includes(m.slug);
          return (
            <button
              key={m.slug}
              type="button"
              onClick={() => toggleMotif(m.slug)}
              className={`flex flex-col gap-2 overflow-hidden rounded-md border p-2 text-left transition-all ${
                isSelected
                  ? "border-white/25 bg-white/[0.05]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
            >
              {m.screenshots.desktop && (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                  <Image src={m.screenshots.desktop} alt={m.name} fill className="object-cover" sizes="200px" />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="font-mono text-[10px] text-white/80">Selected</span>
                    </div>
                  )}
                </div>
              )}
              <div className="px-0.5">
                <p className="truncate text-[11px] font-medium text-white/80">{m.name}</p>
                <p className="truncate font-mono text-[10px] text-white/30">{m.style}</p>
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
    <Suspense fallback={<div className="py-16 text-center font-mono text-xs text-white/20">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}
