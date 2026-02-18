import Link from "next/link";
import Image from "next/image";
import type { Motif } from "@/lib/types";
import { ColorDNA } from "@/components/color-dna";

interface MotifCardProps {
  motif: Motif;
}

export function MotifCard({ motif }: MotifCardProps) {
  const accentColors = Object.values(motif.tokens.colors.accent).slice(0, 5);

  return (
    <Link
      href={`/motifs/${motif.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.04]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-white/[0.03]">
        {motif.screenshots.desktop ? (
          <Image
            src={motif.screenshots.desktop}
            alt={motif.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-xs text-white/20">No screenshot</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-sm font-semibold text-white">{motif.name}</p>
          <p className="mt-0.5 text-xs text-white/50">{motif.style}</p>
        </div>

        {accentColors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {accentColors.map((hex) => (
              <span
                key={hex}
                className="h-3 w-3 rounded-full border border-white/10"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        )}

        {accentColors.length > 0 && (
          <div className="w-full overflow-hidden rounded">
            <ColorDNA colors={accentColors} height={32} width={200} />
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/50">
            {motif.engagement.toFixed(1)}
          </span>
          <span className="font-mono text-[10px] text-white/30">
            {motif.motifs.length} effects
          </span>
        </div>
      </div>
    </Link>
  );
}
