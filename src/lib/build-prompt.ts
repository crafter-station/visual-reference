import type { VisualReference } from "./types";

function formatColors(colors: Record<string, string>): string {
  return Object.entries(colors)
    .map(([name, hex]) => `  ${name}: ${hex}`)
    .join("\n");
}

export function buildPrompt(ref: VisualReference): string {
  const lines: string[] = [
    `Build a web page using this visual system:`,
    ``,
    `Visual System: ${ref.name}`,
    `Style: ${ref.style}`,
    `Mode: ${ref.mode}`,
    ``,
    `Colors`,
    `Background:`,
    formatColors(ref.tokens.colors.background),
    `Accent:`,
    formatColors(ref.tokens.colors.accent),
    `Text:`,
    formatColors(ref.tokens.colors.text),
    ``,
    `Typography`,
    `  Display: ${ref.tokens.typography.families.display}`,
    `  Body: ${ref.tokens.typography.families.body}`,
  ];

  if (ref.tokens.typography.families.mono) {
    lines.push(`  Mono: ${ref.tokens.typography.families.mono}`);
  }

  if (ref.effects.length > 0) {
    lines.push(``, `Effects`);
    for (const tag of ref.effects) {
      const hint = tag.cssHint ? ` — ${tag.cssHint}` : "";
      lines.push(`  - ${tag.name}${hint}`);
    }
  }

  if (ref.coreAesthetic) {
    lines.push(``, `Design Direction`, ref.coreAesthetic);
  }

  lines.push(
    ``,
    `Reference: https://visual-reference.crafter.run/references/${ref.slug}`
  );

  return lines.join("\n");
}
