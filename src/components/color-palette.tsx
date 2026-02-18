"use client";

import { useState } from "react";

interface ColorPaletteProps {
  colors: Record<string, string>;
  label?: string;
}

export function ColorPalette({ colors, label }: ColorPaletteProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function handleCopy(hex: string) {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  }

  const entries = Object.entries(colors);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div>
      {label && (
        <p className="mb-2 font-mono text-xs text-white/30">{label}</p>
      )}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {entries.map(([name, hex]) => (
          <button
            key={name}
            type="button"
            onClick={() => handleCopy(hex)}
            className="group flex flex-col items-center gap-1.5"
            title={`Copy ${hex}`}
          >
            <span
              className="h-8 w-8 rounded-full border border-white/10 transition-transform group-hover:scale-110"
              style={{ backgroundColor: hex }}
            />
            <span className="font-mono text-[9px] text-white/30 transition-colors group-hover:text-white/60">
              {copied === hex ? "Copied!" : hex.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
