"use client";

import { useState } from "react";

interface ColorSwatchProps {
  name: string;
  hex: string;
}

export function ColorSwatch({ name, hex }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="group flex items-center gap-2.5"
    >
      <span
        className="h-5 w-5 shrink-0 rounded-[3px] border border-white/[0.08] transition-transform group-hover:scale-110"
        style={{ backgroundColor: hex }}
      />
      <span className="min-w-0 flex-1 truncate text-left font-mono text-[10px] text-white/30">
        {name}
      </span>
      <span className="font-mono text-[10px] text-white/50 transition-colors group-hover:text-white/80">
        {copied ? "copied" : hex}
      </span>
    </button>
  );
}
