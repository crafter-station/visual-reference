import type { MotifTag } from "@/lib/types";
import { MOTIF_CATEGORY_COLORS } from "@/lib/taxonomy";

interface EffectTagProps {
  tag: MotifTag;
}

export function EffectTag({ tag }: EffectTagProps) {
  const color = MOTIF_CATEGORY_COLORS[tag.category];

  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {tag.name}
    </span>
  );
}
