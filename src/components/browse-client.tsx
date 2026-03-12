"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";
import { Search, X, Download } from "lucide-react";
import type { VisualReference, EffectCategory } from "@/lib/types";
import { EFFECT_CATEGORY_LABELS, EFFECT_CATEGORY_COLORS } from "@/lib/taxonomy";
import { ReferenceCard } from "./reference-card";
import { SubmitModal } from "./submit-modal";

const PAGE_SIZE = 12;

const SKILL_INSTALL_URL =
  "https://github.com/crafter-station/visual-reference#skill";

interface BrowseClientProps {
  references: VisualReference[];
  featured: VisualReference[];
}

export function BrowseClient({ references, featured }: BrowseClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<EffectCategory | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [submitOpen, setSubmitOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fuse = useRef(
    new Fuse(references, {
      keys: [
        { name: "name", weight: 2 },
        { name: "style", weight: 1.5 },
        { name: "coreAesthetic", weight: 1 },
        { name: "whyItWorks", weight: 0.8 },
        { name: "effects.name", weight: 0.6 },
        { name: "tokens.typography.families.display", weight: 0.5 },
      ],
      threshold: 0.35,
      includeScore: true,
    })
  );

  const filtered = (() => {
    let base: VisualReference[] = query.trim()
      ? fuse.current.search(query.trim()).map((r) => r.item)
      : references;

    if (activeCategory) {
      base = base.filter((r) =>
        r.effects.some((t) => t.category === activeCategory)
      );
    }

    return base;
  })();

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => {
    setVisibleCount((n) => n + PAGE_SIZE);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, activeCategory]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const isSearching = query.trim() !== "" || activeCategory !== null;
  const showFeatured = !isSearching;

  const categories = Object.keys(EFFECT_CATEGORY_LABELS) as EffectCategory[];

  return (
    <>
      <SubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} />

      {/* Sticky search + filter bar */}
      <div className="sticky top-[45px] z-40 border-b border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1400px] px-6">
          {/* Search + actions row */}
          <div className="flex items-center gap-3 py-3">
            <div className="relative flex flex-1 items-center">
              <Search
                size={13}
                className="absolute left-3 text-white/30"
              />
              <input
                type="text"
                placeholder="Search design systems, aesthetics, effects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-white/[0.08] bg-white/[0.03] py-2 pl-8 pr-8 font-mono text-[12px] text-white placeholder-white/25 outline-none transition-colors focus:border-white/[0.18]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 text-white/30 hover:text-white/60"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className="shrink-0 rounded-md border border-white/[0.1] bg-white/[0.04] px-3 py-2 font-mono text-[11px] text-white/60 transition-colors hover:border-white/[0.2] hover:text-white/90"
            >
              + Submit
            </button>

            <a
              href={SKILL_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/[0.14] bg-white/[0.06] px-3 py-2 font-mono text-[11px] text-white/80 transition-colors hover:bg-white/[0.1]"
            >
              <Download size={11} />
              Install Skill
            </a>
          </div>

          {/* Filter pills row */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all"
              style={
                !activeCategory
                  ? {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "rgba(255,255,255,0.35)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }
              }
            >
              All
            </button>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const color = EFFECT_CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setActiveCategory(isActive ? null : cat)
                  }
                  className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all"
                  style={
                    isActive
                      ? {
                          backgroundColor: `${color}22`,
                          color: color,
                          border: `1px solid ${color}55`,
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "rgba(255,255,255,0.35)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }
                  }
                >
                  {EFFECT_CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-6 pb-20">
        {/* Header */}
        <div className="py-10">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-3xl tracking-tight">
              Visual Reference
            </h1>
            <span className="rounded-sm bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-white/40">
              v0.2
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[12px] text-white/35">
            {references.length} visual systems — extracted tokens, psychological
            justification, prompt-ready
          </p>
        </div>

        {/* Skill install CTA */}
        <div className="mb-10 flex items-center justify-between rounded-md border border-white/[0.07] bg-white/[0.02] px-5 py-4">
          <div>
            <p className="text-[13px] font-medium text-white/80">
              Extract any site's design system in seconds
            </p>
            <code className="mt-1 block font-mono text-[11px] text-white/40">
              claude /visual-reference https://example.com
            </code>
          </div>
          <a
            href={SKILL_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/[0.14] bg-white/[0.06] px-4 py-2 font-mono text-[11px] text-white/70 transition-colors hover:bg-white/[0.1]"
          >
            <Download size={11} />
            Install Skill
          </a>
        </div>

        {/* Featured */}
        {showFeatured && featured.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Featured
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((ref) => (
                <ReferenceCard key={ref.slug} reference={ref} />
              ))}
            </div>
          </section>
        )}

        {/* Browse grid */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              {isSearching ? "Results" : "All References"}
            </h2>
            <span className="font-mono text-[10px] text-white/20">
              {filtered.length} systems
            </span>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {visible.map((ref) => (
                  <ReferenceCard key={ref.slug} reference={ref} />
                ))}
              </div>
              <div ref={sentinelRef} className="h-1" />
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <span className="font-mono text-[11px] text-white/20">
                    Loading more...
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-48 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02]">
              <p className="font-mono text-[12px] text-white/30">
                No results for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
