import type { Motif } from "./types";

function formatColors(colors: Record<string, string>): string {
  return Object.entries(colors)
    .map(([name, hex]) => `  ${name}: ${hex}`)
    .join("\n");
}

export function buildPrompt(motif: Motif): string {
  const lines: string[] = [
    `Build a web page using this visual system:`,
    ``,
    `Visual System: ${motif.name}`,
    `Style: ${motif.style}`,
    `Mode: ${motif.mode}`,
    ``,
    `Colors`,
    `Background:`,
    formatColors(motif.tokens.colors.background),
    `Accent:`,
    formatColors(motif.tokens.colors.accent),
    `Text:`,
    formatColors(motif.tokens.colors.text),
    ``,
    `Typography`,
    `  Display: ${motif.tokens.typography.families.display}`,
    `  Body: ${motif.tokens.typography.families.body}`,
  ];

  if (motif.tokens.typography.families.mono) {
    lines.push(`  Mono: ${motif.tokens.typography.families.mono}`);
  }

  if (motif.motifs.length > 0) {
    lines.push(``, `Effects`);
    for (const tag of motif.motifs) {
      const hint = tag.cssHint ? ` — ${tag.cssHint}` : "";
      lines.push(`  - ${tag.name}${hint}`);
    }
  }

  if (motif.coreAesthetic) {
    lines.push(``, `Design Direction`, motif.coreAesthetic);
  }

  lines.push(
    ``,
    `Reference: https://visual-reference.crafter.run/references/${motif.slug}`
  );

  return lines.join("\n");
}
