import type { NormalizedTokens } from "./types";

export function toJSON(tokens: NormalizedTokens): string {
  return JSON.stringify(tokens, null, 2);
}

export function toCSS(tokens: NormalizedTokens, prefix = ""): string {
  const vars: string[] = [];
  const p = prefix ? `${prefix}-` : "";

  for (const [k, v] of Object.entries(tokens.colors.background)) {
    vars.push(`  --${p}color-bg-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.colors.accent)) {
    vars.push(`  --${p}color-accent-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.colors.text)) {
    vars.push(`  --${p}color-text-${k}: ${v};`);
  }

  vars.push(`  --${p}font-display: ${tokens.typography.families.display};`);
  vars.push(`  --${p}font-body: ${tokens.typography.families.body};`);
  if (tokens.typography.families.mono) {
    vars.push(`  --${p}font-mono: ${tokens.typography.families.mono};`);
  }

  for (const [k, v] of Object.entries(tokens.typography.scale)) {
    vars.push(`  --${p}text-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.typography.weights)) {
    vars.push(`  --${p}weight-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.typography.lineHeights)) {
    vars.push(`  --${p}leading-${k}: ${v};`);
  }

  for (const [k, v] of Object.entries(tokens.spacing)) {
    vars.push(`  --${p}space-${k}: ${v};`);
  }

  for (const [k, v] of Object.entries(tokens.borderRadius)) {
    vars.push(`  --${p}radius-${k}: ${v};`);
  }

  for (const [k, v] of Object.entries(tokens.shadows)) {
    vars.push(`  --${p}shadow-${k}: ${v};`);
  }

  for (const [k, v] of Object.entries(tokens.animation.durations)) {
    vars.push(`  --${p}duration-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.animation.easings)) {
    vars.push(`  --${p}easing-${k}: ${v};`);
  }

  return `:root {\n${vars.join("\n")}\n}`;
}

export function toDTCG(tokens: NormalizedTokens, name: string): string {
  const result: Record<string, unknown> = {
    $name: name,
    color: {
      background: Object.fromEntries(
        Object.entries(tokens.colors.background).map(([k, v]) => [
          k,
          { $value: v, $type: "color" },
        ])
      ),
      accent: Object.fromEntries(
        Object.entries(tokens.colors.accent).map(([k, v]) => [
          k,
          { $value: v, $type: "color" },
        ])
      ),
      text: Object.fromEntries(
        Object.entries(tokens.colors.text).map(([k, v]) => [
          k,
          { $value: v, $type: "color" },
        ])
      ),
    },
    typography: {
      family: {
        display: { $value: tokens.typography.families.display, $type: "fontFamily" },
        body: { $value: tokens.typography.families.body, $type: "fontFamily" },
        ...(tokens.typography.families.mono
          ? { mono: { $value: tokens.typography.families.mono, $type: "fontFamily" } }
          : {}),
      },
      scale: Object.fromEntries(
        Object.entries(tokens.typography.scale).map(([k, v]) => [
          k,
          { $value: v, $type: "dimension" },
        ])
      ),
      weight: Object.fromEntries(
        Object.entries(tokens.typography.weights).map(([k, v]) => [
          k,
          { $value: v, $type: "number" },
        ])
      ),
      lineHeight: Object.fromEntries(
        Object.entries(tokens.typography.lineHeights).map(([k, v]) => [
          k,
          { $value: v, $type: "number" },
        ])
      ),
    },
    spacing: Object.fromEntries(
      Object.entries(tokens.spacing).map(([k, v]) => [
        k,
        { $value: v, $type: "dimension" },
      ])
    ),
    borderRadius: Object.fromEntries(
      Object.entries(tokens.borderRadius).map(([k, v]) => [
        k,
        { $value: v, $type: "dimension" },
      ])
    ),
    shadow: Object.fromEntries(
      Object.entries(tokens.shadows).map(([k, v]) => [
        k,
        { $value: v, $type: "shadow" },
      ])
    ),
    animation: {
      duration: Object.fromEntries(
        Object.entries(tokens.animation.durations).map(([k, v]) => [
          k,
          { $value: v, $type: "duration" },
        ])
      ),
      easing: Object.fromEntries(
        Object.entries(tokens.animation.easings).map(([k, v]) => [
          k,
          { $value: v, $type: "cubicBezier" },
        ])
      ),
    },
  };

  return JSON.stringify(result, null, 2);
}

export type ExportFormat = "json" | "css" | "dtcg";

export function exportTokens(
  tokens: NormalizedTokens,
  format: ExportFormat,
  name?: string
): string {
  switch (format) {
    case "json":
      return toJSON(tokens);
    case "css":
      return toCSS(tokens);
    case "dtcg":
      return toDTCG(tokens, name ?? "Motif");
  }
}
