import { ImageResponse } from "@takumi-rs/image-response";
import { getAllEffectCategories } from "@/lib/references";
import { EFFECT_CATEGORY_LABELS, EFFECT_CATEGORY_COLORS } from "@/lib/taxonomy";
import type { EffectCategory } from "@/lib/types";

export const alt = "Effect Category";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllEffectCategories().map(({ category }) => ({ category }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const label = EFFECT_CATEGORY_LABELS[category as EffectCategory] ?? category;
  const color = EFFECT_CATEGORY_COLORS[category as EffectCategory] ?? "#ffffff";

  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-end bg-[#0a0a0a] p-16">
      <div tw="flex items-center gap-3">
        <div
          tw="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div tw="text-lg text-white/30">visual-reference.crafter.run/effects</div>
      </div>
      <div
        tw="mt-3 text-6xl font-bold text-white"
        style={{ fontFamily: "Geist", letterSpacing: "-0.03em" }}
      >
        {label}
      </div>
    </div>,
    { ...size }
  );
}
