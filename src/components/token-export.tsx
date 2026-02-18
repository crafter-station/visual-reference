"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import type { NormalizedTokens } from "@/lib/types";
import { exportTokens, type ExportFormat } from "@/lib/export-tokens";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TokenExportProps {
  tokens: NormalizedTokens;
  name: string;
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  json: "JSON",
  css: "CSS Variables",
  dtcg: "W3C DTCG",
};

export function TokenExport({ tokens, name }: TokenExportProps) {
  const [copied, setCopied] = useState(false);

  async function handleExport(format: ExportFormat) {
    const content = exportTokens(tokens, format, name);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          {copied ? "Copied!" : "Export Tokens"}
          <ChevronDownIcon className="size-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(FORMAT_LABELS) as ExportFormat[]).map((format) => (
          <DropdownMenuItem
            key={format}
            onSelect={() => handleExport(format)}
            className="cursor-pointer"
          >
            {FORMAT_LABELS[format]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
