import { ImageResponse } from "@takumi-rs/image-response";

export const alt = "Browse Visual Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-end bg-[#0a0a0a] p-16">
      <div tw="text-lg text-white/30">visual-reference.crafter.run</div>
      <div
        tw="mt-2 text-6xl font-bold text-white"
        style={{ fontFamily: "Geist", letterSpacing: "-0.03em" }}
      >
        Browse Visual Systems
      </div>
      <div tw="mt-3 text-xl text-white/40">
        29 curated design references with extractable tokens
      </div>
    </div>,
    { ...size }
  );
}
