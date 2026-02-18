import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMotifBySlug, getMotifSlugs } from "@/lib/motifs";
import { MOTIF_CATEGORY_COLORS } from "@/lib/taxonomy";
import { PromptCopy } from "@/components/prompt-copy";
import { TokenExport } from "@/components/token-export";
import { ColorSwatch } from "@/components/color-swatch";

interface MotifDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getMotifSlugs().map((slug) => ({ slug }));
}

export default async function MotifDetailPage({ params }: MotifDetailPageProps) {
  const { slug } = await params;
  const motif = getMotifBySlug(slug);

  if (!motif) {
    notFound();
  }

  const bgColors = Object.entries(motif.tokens.colors.background).slice(0, 4);
  const accentColors = Object.entries(motif.tokens.colors.accent).slice(0, 4);
  const textColors = Object.entries(motif.tokens.colors.text).slice(0, 3);
  const allColorEntries = [...bgColors, ...accentColors, ...textColors];
  const effects = motif.motifs.slice(0, 8);

  return (
    <main className="flex h-[calc(100vh-41px)] overflow-hidden">
      <div className="relative flex-1 overflow-hidden">
        {motif.screenshots.desktop ? (
          <>
            <Image
              src={motif.screenshots.desktop}
              alt={motif.name}
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 via-transparent to-[#0a0a0a]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-white/[0.02]">
            <span className="font-mono text-xs text-white/20">No preview</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-6">
          <Link
            href="/references"
            className="mb-3 inline-block font-mono text-[10px] text-white/40 transition-colors hover:text-white/70"
          >
            &larr; browse
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">
            {motif.name}
          </h1>
          <p className="mt-0.5 text-sm text-white/50">{motif.style}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-white/[0.1] px-1.5 py-0.5 font-mono text-[9px] text-white/60">
              {motif.mode}
            </span>
            <span className="font-mono text-[9px] text-white/30">
              {motif.motifs.length} effects
            </span>
            <span className="font-mono text-[9px] text-white/30">
              {motif.huntDate}
            </span>
            {motif.sourceUrl && (
              <a
                href={motif.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] text-white/30 transition-colors hover:text-white/60"
              >
                {new URL(motif.sourceUrl).hostname} &nearr;
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-[340px] shrink-0 flex-col border-l border-white/[0.06] bg-[#0a0a0a] lg:w-[380px]">
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <PromptCopy motif={motif} />
            </div>
            <div className="flex-1">
              <TokenExport tokens={motif.tokens} name={motif.name} />
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
              Palette
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {allColorEntries.map(([name, hex]) => (
                <ColorSwatch key={name} name={name} hex={hex} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
              Typography
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[9px] text-white/25">display</span>
                <span className="text-[13px] font-bold text-white/80" style={{ fontFamily: motif.tokens.typography.families.display }}>
                  {motif.tokens.typography.families.display}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[9px] text-white/25">body</span>
                <span className="text-[12px] text-white/50" style={{ fontFamily: motif.tokens.typography.families.body }}>
                  {motif.tokens.typography.families.body}
                </span>
              </div>
              {motif.tokens.typography.families.mono && (
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[9px] text-white/25">mono</span>
                  <span className="font-mono text-[12px] text-white/50">
                    {motif.tokens.typography.families.mono}
                  </span>
                </div>
              )}
            </div>
          </div>

          {effects.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
                Effects
              </p>
              <div className="flex flex-wrap gap-1">
                {effects.map((tag) => {
                  const color = MOTIF_CATEGORY_COLORS[tag.category];
                  return (
                    <Link
                      key={tag.slug}
                      href={`/effects/${tag.category}`}
                      className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[9px] transition-colors hover:bg-white/[0.06]"
                      style={{
                        backgroundColor: `${color}10`,
                        color: `${color}cc`,
                      }}
                    >
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {tag.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {motif.coreAesthetic && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
                Design Direction
              </p>
              <p className="text-[11px] leading-relaxed text-white/45">
                {motif.coreAesthetic}
              </p>
            </div>
          )}

          {motif.techStack.length > 0 && (
            <div>
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
                Stack
              </p>
              <div className="flex flex-wrap gap-1">
                {motif.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/35"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
