import { ImageResponse } from "@takumi-rs/image-response";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getMotifBySlug, getMotifSlugs } from "@/lib/motifs";

export const alt = "Visual System";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getMotifSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const motif = getMotifBySlug(slug);

  if (!motif) {
    return new ImageResponse(
      <div tw="flex h-full w-full items-center justify-center bg-[#0a0a0a]">
        <div tw="text-4xl text-white/30">Not Found</div>
      </div>,
      { ...size }
    );
  }

  const allColors = [
    ...Object.values(motif.tokens.colors.background),
    ...Object.values(motif.tokens.colors.accent),
  ].slice(0, 8);

  let screenshotSrc: string | null = null;
  if (motif.screenshots.desktop) {
    try {
      const imgPath = join(process.cwd(), "public", motif.screenshots.desktop);
      const data = await readFile(imgPath, "base64");
      const ext = motif.screenshots.desktop.endsWith(".jpg") ? "jpeg" : "png";
      screenshotSrc = `data:image/${ext};base64,${data}`;
    } catch {
      // screenshot not available, skip
    }
  }

  return new ImageResponse(
    <div tw="flex h-full w-full bg-[#0a0a0a]">
      {screenshotSrc ? (
        <div tw="flex h-full w-[680px]">
          <img
            src={screenshotSrc}
            width={680}
            height={630}
            tw="object-cover"
            style={{ objectPosition: "top" }}
          />
        </div>
      ) : (
        <div tw="flex h-full w-[680px] items-center justify-center bg-white/3">
          <div tw="text-2xl text-white/20">No preview</div>
        </div>
      )}

      <div tw="flex h-full flex-1 flex-col justify-between p-12">
        <div tw="flex flex-col">
          <div tw="text-sm text-white/30">visual-reference.crafter.run</div>
          <div
            tw="mt-4 text-4xl font-bold text-white"
            style={{ fontFamily: "Geist", letterSpacing: "-0.02em" }}
          >
            {motif.name}
          </div>
          <div tw="mt-2 text-lg text-white/40">{motif.style}</div>
          <div tw="mt-4 flex items-center gap-2">
            <div tw="rounded bg-white/8 px-2 py-1 text-xs text-white/50">
              {motif.mode}
            </div>
            <div tw="text-xs text-white/25">
              {motif.motifs.length} effects
            </div>
          </div>
        </div>

        <div tw="flex flex-col gap-4">
          <div tw="flex gap-1">
            {allColors.map((hex) => (
              <div
                key={hex}
                tw="h-6 w-12 rounded"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <div tw="flex items-center gap-3">
            <div tw="text-sm text-white/30">
              {motif.tokens.typography.families.display}
            </div>
            {motif.tokens.typography.families.mono && (
              <>
                <div tw="text-sm text-white/15">/</div>
                <div tw="text-sm text-white/30">
                  {motif.tokens.typography.families.mono}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
