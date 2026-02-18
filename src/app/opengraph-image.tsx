import { ImageResponse } from "@takumi-rs/image-response";

export const alt = "Visual Reference — Design tokens from real-world sites";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      tw="flex h-full w-full flex-col justify-between bg-[#0a0a0a] p-16"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.02) 0%, transparent 50%)",
      }}
    >
      <div tw="flex items-center">
        <div tw="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
          <div tw="text-2xl font-bold text-white">VR</div>
        </div>
        <div tw="ml-3 flex flex-col">
          <div tw="text-sm font-medium text-white/80">visual-reference</div>
          <div tw="text-xs text-white/30">.crafter.run</div>
        </div>
      </div>

      <div tw="flex flex-col">
        <div
          tw="text-7xl font-bold text-white"
          style={{ fontFamily: "Geist", letterSpacing: "-0.03em" }}
        >
          Visual Reference
        </div>
        <div tw="mt-4 text-2xl text-white/40">
          Prompt-first design tokens from real-world sites
        </div>
        <div tw="mt-8 flex items-center gap-6">
          <div tw="flex items-center gap-2 rounded-md bg-white/6 px-4 py-2">
            <div tw="text-sm font-medium text-white/60">29 visual systems</div>
          </div>
          <div tw="flex items-center gap-2 rounded-md bg-white/6 px-4 py-2">
            <div tw="text-sm font-medium text-white/60">80+ effects</div>
          </div>
          <div tw="flex items-center gap-2 rounded-md bg-white/6 px-4 py-2">
            <div tw="text-sm font-medium text-white/60">copy prompt &rarr; build</div>
          </div>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
