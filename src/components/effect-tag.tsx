import type { EffectTag as EffectTagType } from "@/lib/types";
import { EFFECT_CATEGORY_COLORS } from "@/lib/taxonomy";

interface EffectTagProps {
  tag: EffectTagType;
}

export function EffectTag({ tag }: EffectTagProps) {
  const color = EFFECT_CATEGORY_COLORS[tag.category];

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
