import Link from "next/link";
import Image from "next/image";
import type { Motif } from "@/lib/types";

interface MotifCardProps {
  motif: Motif;
}

export function MotifCard({ motif }: MotifCardProps) {
  const allColors = [
    ...Object.values(motif.tokens.colors.background),
    ...Object.values(motif.tokens.colors.accent),
    ...Object.values(motif.tokens.colors.text),
  ].slice(0, 8);

  return (
    <Link
      href={`/motifs/${motif.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/[0.14]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {motif.screenshots.desktop ? (
          <Image
            src={motif.screenshots.desktop}
            alt={motif.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/[0.03]">
            <span className="font-mono text-[10px] text-white/20">No preview</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-white">{motif.name}</p>
            <p className="truncate text-[11px] text-white/40">{motif.style}</p>
          </div>
          <span className="shrink-0 font-mono text-[10px] text-white/25">
            {motif.motifs.length}fx
          </span>
        </div>

        <div className="flex h-1.5 w-full gap-px overflow-hidden rounded-full">
          {allColors.map((hex, i) => (
            <div
              key={`${hex}-${i}`}
              className="h-full flex-1"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
