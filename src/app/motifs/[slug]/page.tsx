import { notFound } from "next/navigation";
import Image from "next/image";
import { getMotifBySlug, getMotifSlugs } from "@/lib/motifs";
import { MOTIF_CATEGORY_COLORS } from "@/lib/taxonomy";
import { Badge } from "@/components/ui/badge";
import { ColorPalette } from "@/components/color-palette";
import { EffectTag } from "@/components/effect-tag";
import { PromptCopy } from "@/components/prompt-copy";
import { TokenExport } from "@/components/token-export";

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

  const accentColors = motif.tokens.colors.accent;
  const bgColors = motif.tokens.colors.background;
  const allColors = { ...bgColors, ...accentColors };

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-8">
          {motif.screenshots.desktop && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/[0.06]">
              <Image
                src={motif.screenshots.desktop}
                alt={motif.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <section>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
              Why It Works
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              {motif.whyItWorks}
            </p>
          </section>

          {motif.coreAesthetic && (
            <section>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
                Core Aesthetic
              </h2>
              <p className="text-sm leading-relaxed text-white/70">
                {motif.coreAesthetic}
              </p>
            </section>
          )}

          {motif.techStack.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {motif.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-mono text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:sticky lg:top-20 lg:self-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{motif.name}</h1>
            <p className="mt-1 text-sm text-white/50">{motif.style}</p>
            {motif.sourceUrl && (
              <a
                href={motif.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-mono text-xs text-white/30 transition-colors hover:text-white/60"
              >
                {new URL(motif.sourceUrl).hostname}
              </a>
            )}
          </div>

          <section>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
              Color Palette
            </h2>
            <ColorPalette colors={allColors} />
          </section>

          <section>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
              Typography
            </h2>
            <div className="space-y-2">
              <div>
                <p className="font-mono text-xs text-white/30">Display</p>
                <p className="mt-0.5 text-lg font-bold" style={{ fontFamily: motif.tokens.typography.families.display }}>
                  {motif.tokens.typography.families.display}
                </p>
              </div>
              {motif.tokens.typography.families.mono && (
                <div>
                  <p className="font-mono text-xs text-white/30">Mono</p>
                  <p className="mt-0.5 font-mono text-sm text-white/70">
                    {motif.tokens.typography.families.mono}
                  </p>
                </div>
              )}
            </div>
          </section>

          {motif.motifs.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
                Effects
              </h2>
              <div className="flex flex-wrap gap-2">
                {motif.motifs.map((tag) => (
                  <EffectTag key={tag.slug} tag={tag} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
              Meta
            </h2>
            <dl className="space-y-1.5">
              <div className="flex items-center justify-between">
                <dt className="font-mono text-xs text-white/30">Engagement</dt>
                <dd className="font-mono text-xs text-white/70">{motif.engagement.toFixed(1)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-mono text-xs text-white/30">Mode</dt>
                <dd className="font-mono text-xs text-white/70">{motif.mode}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-mono text-xs text-white/30">Hunted</dt>
                <dd className="font-mono text-xs text-white/70">{motif.huntDate}</dd>
              </div>
            </dl>
          </section>

          <PromptCopy motif={motif} />
          <TokenExport tokens={motif.tokens} name={motif.name} />
        </div>
      </div>
    </main>
  );
}
