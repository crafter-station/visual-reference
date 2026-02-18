"use client";

import { useState } from "react";
import { ClipboardCopyIcon, CheckIcon } from "lucide-react";
import type { VisualReference } from "@/lib/types";
import { buildPrompt } from "@/lib/build-prompt";

interface PromptCopyProps {
  reference: VisualReference;
}

export function PromptCopy({ reference }: PromptCopyProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const prompt = buildPrompt(reference);
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-white/[0.14] bg-white/[0.06] px-4 py-2.5 font-mono text-[12px] font-medium text-white/80 transition-all hover:bg-white/[0.10] hover:text-white"
    >
      {copied ? (
        <>
          <CheckIcon className="size-3.5" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardCopyIcon className="size-3.5" />
          Copy Prompt
        </>
      )}
    </button>
  );
}
