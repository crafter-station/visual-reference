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

  const bgColors = Object.entries(motif.tokens.colors.background);
  const accentColors = Object.entries(motif.tokens.colors.accent);
  const textColors = Object.entries(motif.tokens.colors.text);

  return (
    <main className="min-h-screen">
      <section className="relative w-full">
        {motif.screenshots.desktop ? (
          <div className="relative h-[70vh] w-full overflow-hidden">
            <Image
              src={motif.screenshots.desktop}
              alt={motif.name}
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-8 pb-8">
              <div className="mx-auto max-w-[1400px]">
                <Link
                  href="/motifs"
                  className="mb-4 inline-block font-mono text-[11px] text-white/40 transition-colors hover:text-white/70"
                >
                  &larr; motifs
                </Link>
                <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                  {motif.name}
                </h1>
                <p className="mt-1 text-lg text-white/50">{motif.style}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-sm bg-white/[0.08] px-2 py-0.5 font-mono text-[10px] text-white/50">
                    {motif.mode}
                  </span>
                  <span className="font-mono text-[10px] text-white/25">
                    {motif.motifs.length} effects
                  </span>
                  <span className="font-mono text-[10px] text-white/25">
                    {motif.huntDate}
                  </span>
                  {motif.sourceUrl && (
                    <a
                      href={motif.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-white/25 transition-colors hover:text-white/50"
                    >
                      {new URL(motif.sourceUrl).hostname} &nearr;
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center bg-white/[0.02]">
            <span className="font-mono text-xs text-white/20">No preview</span>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1400px] px-8 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Background
                </p>
                <div className="flex flex-col gap-2">
                  {bgColors.map(([name, hex]) => (
                    <ColorSwatch key={name} name={name} hex={hex} />
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Accent
                </p>
                <div className="flex flex-col gap-2">
                  {accentColors.map(([name, hex]) => (
                    <ColorSwatch key={name} name={name} hex={hex} />
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Text
                </p>
                <div className="flex flex-col gap-2">
                  {textColors.map(([name, hex]) => (
                    <ColorSwatch key={name} name={name} hex={hex} />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Typography
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-mono text-[10px] text-white/25">display</p>
                    <p className="text-xl font-bold text-white/90" style={{ fontFamily: motif.tokens.typography.families.display }}>
                      {motif.tokens.typography.families.display}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-white/25">body</p>
                    <p className="text-sm text-white/60" style={{ fontFamily: motif.tokens.typography.families.body }}>
                      {motif.tokens.typography.families.body}
                    </p>
                  </div>
                  {motif.tokens.typography.families.mono && (
                    <div>
                      <p className="font-mono text-[10px] text-white/25">mono</p>
                      <p className="font-mono text-sm text-white/60">
                        {motif.tokens.typography.families.mono}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {motif.motifs.length > 0 && (
                <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                    Effects
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {motif.motifs.map((tag) => {
                      const color = MOTIF_CATEGORY_COLORS[tag.category];
                      return (
                        <Link
                          key={tag.slug}
                          href={`/effects/${tag.category}`}
                          className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[10px] transition-colors hover:bg-white/[0.06]"
                          style={{
                            backgroundColor: `${color}10`,
                            color: `${color}cc`,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {tag.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {motif.coreAesthetic && (
              <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Design Direction
                </p>
                <p className="text-[13px] leading-relaxed text-white/60">
                  {motif.coreAesthetic}
                </p>
              </div>
            )}

            {motif.whyItWorks && (
              <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Why It Works
                </p>
                <p className="text-[13px] leading-relaxed text-white/60">
                  {motif.whyItWorks}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 lg:sticky lg:top-16 lg:self-start">
            <PromptCopy motif={motif} />
            <TokenExport tokens={motif.tokens} name={motif.name} />

            {motif.techStack.length > 0 && (
              <div className="mt-2 rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-1">
                  {motif.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-sm bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {motif.categories.length > 0 && (
              <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Categories
                </p>
                <div className="flex flex-wrap gap-1">
                  {motif.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-sm bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/40"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
