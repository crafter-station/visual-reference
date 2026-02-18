"use client";

import { useState } from "react";
import { ClipboardCopyIcon, CheckIcon } from "lucide-react";
import type { Motif } from "@/lib/types";
import { buildPrompt } from "@/lib/build-prompt";

export function CardCopyButton({ motif }: { motif: Motif }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const prompt = buildPrompt(motif);
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-sm p-1 text-white/20 transition-colors hover:bg-white/[0.08] hover:text-white/60"
      title="Copy prompt"
    >
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <ClipboardCopyIcon className="size-3.5" />
      )}
    </button>
  );
}
