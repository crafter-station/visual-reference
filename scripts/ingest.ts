#!/usr/bin/env bun

import { readdir, readFile, mkdir, copyFile, writeFile, access } from "fs/promises";
import { join, basename, dirname } from "path";

const VAULT_ROOT = "/Users/raillyhugo/hunter-brain";
const TEMPLATES_ROOT = join(VAULT_ROOT, "06_Content/v0-templates");
const HUNT_INDEX_PATH = join(VAULT_ROOT, "05_Areas/v0-ambassador/hunt-library-index.md");
const OUT_CONTENT_DIR = join(import.meta.dir, "../src/content/motifs");
const OUT_PUBLIC_DIR = join(import.meta.dir, "../public/motifs");

type Category = "Portfolio" | "B2B SaaS" | "Dev Tools" | "VC / Finance" | "Creative / 3D" | "Education" | "Fintech";
type MotifCategory = "background-treatment" | "hover-interaction" | "entrance-animation" | "layout-pattern" | "visual-accent" | "content-pattern" | "illustration-system" | "3d-spatial";
type PaletteMode = "dark" | "light" | "warm";

interface MotifTag {
  slug: string;
  name: string;
  category: MotifCategory;
  cssHint?: string;
}

interface NormalizedTokens {
  colors: {
    background: Record<string, string>;
    accent: Record<string, string>;
    text: Record<string, string>;
  };
  typography: {
    families: { display: string; body: string; mono?: string };
    scale: Record<string, string>;
    weights: Record<string, number>;
    lineHeights: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  animation: {
    durations: Record<string, string>;
    easings: Record<string, string>;
  };
}

interface Motif {
  slug: string;
  name: string;
  style: string;
  sourceUrl?: string;
  huntDate: string;
  categories: Category[];
  engagement: number;
  mode: PaletteMode;
  tokens: NormalizedTokens;
  motifs: MotifTag[];
  whyItWorks: string;
  coreAesthetic: string;
  techStack: string[];
  screenshots: { desktop: string; tablet?: string; mobile?: string };
}

interface HuntIndexEntry {
  slug: string;
  name: string;
  style: string;
  categories: Category[];
  engagement: number;
  mode: PaletteMode;
  whyItWorks: string;
  techStack: string[];
  date: string;
}

const DARK_MODE_HUNTS = new Set([
  "hunt-hex-inc", "hunt-replo", "hunt-detail", "hunt-momentic",
  "hunt-plasticity", "hunt-blink", "hunt-hivemind", "hunt-harbour", "hunt-patchwork",
]);
const WARM_MODE_HUNTS = new Set(["hunt-mnhvc", "hunt-millennium"]);

const CATEGORY_MAP: Record<string, Category> = {
  "Portfolio": "Portfolio",
  "Agency Landing": "Portfolio",
  "Creator Platform": "Portfolio",
  "B2B SaaS": "B2B SaaS",
  "E-commerce": "B2B SaaS",
  "Support": "B2B SaaS",
  "Workspace": "B2B SaaS",
  "RevOps": "B2B SaaS",
  "Dev Tools": "Dev Tools",
  "Testing": "Dev Tools",
  "VC": "VC / Finance",
  "Investment": "VC / Finance",
  "Bitcoin Fund": "VC / Finance",
  "Finance": "VC / Finance",
  "Fintech": "Fintech",
  "Banking": "Fintech",
  "Creative": "Creative / 3D",
  "CAD Software": "Creative / 3D",
  "Education": "Education",
  "EdTech": "Education",
  "Business Services": "B2B SaaS",
};

const TAXONOMY: Record<string, { category: MotifCategory; name: string }> = {
  "starfield-background": { category: "background-treatment", name: "Starfield Background" },
  "color-block-sections": { category: "background-treatment", name: "Color Block Sections" },
  "scroll-driven-color-zones": { category: "background-treatment", name: "Scroll-Driven Color Zones" },
  "dark-premium-aesthetic": { category: "background-treatment", name: "Dark Premium Aesthetic" },
  "alternating-dark-cream-sections": { category: "background-treatment", name: "Alternating Dark/Cream" },
  "dot-pattern-branding": { category: "background-treatment", name: "Dot Pattern Branding" },
  "extreme-whitespace": { category: "background-treatment", name: "Extreme Whitespace" },
  "radical-whitespace": { category: "background-treatment", name: "Radical Whitespace" },
  "philosophical-minimalism": { category: "background-treatment", name: "Philosophical Minimalism" },
  "mesh-gradients": { category: "background-treatment", name: "Mesh Gradients" },
  "card-hover-lift": { category: "hover-interaction", name: "Card Hover Lift" },
  "button-hover-brightness": { category: "hover-interaction", name: "Button Hover Brightness" },
  "hover-lift-animation": { category: "hover-interaction", name: "Hover Lift Animation" },
  "hover-brightness": { category: "hover-interaction", name: "Hover Brightness" },
  "card-float-on-color": { category: "hover-interaction", name: "Card Float on Color" },
  "fade-up-entrance": { category: "entrance-animation", name: "Fade Up Entrance" },
  "perspective-grid": { category: "entrance-animation", name: "Perspective Grid" },
  "masonry-grid-layout": { category: "layout-pattern", name: "Masonry Grid" },
  "diagonal-section-cuts": { category: "layout-pattern", name: "Diagonal Section Cuts" },
  "side-by-side-layout": { category: "layout-pattern", name: "Side-by-Side Layout" },
  "editorial-minimalism": { category: "layout-pattern", name: "Editorial Minimalism" },
  "high-contrast-sections": { category: "layout-pattern", name: "High Contrast Sections" },
  "dramatic-negative-space": { category: "layout-pattern", name: "Dramatic Negative Space" },
  "neon-glow-subtle": { category: "visual-accent", name: "Neon Glow (Subtle)" },
  "neon-glow-accents": { category: "visual-accent", name: "Neon Glow Accents" },
  "glass-morphic-cards": { category: "visual-accent", name: "Glass-Morphic Cards" },
  "hairline-borders": { category: "visual-accent", name: "Hairline Borders" },
  "minimal-borders": { category: "visual-accent", name: "Minimal Borders" },
  "halftone-dot-pattern": { category: "visual-accent", name: "Halftone Dot Pattern" },
  "underline-emphasis": { category: "visual-accent", name: "Underline Emphasis" },
  "arrow-motif": { category: "visual-accent", name: "Arrow Motif" },
  "pill-shaped-ctas": { category: "visual-accent", name: "Pill-Shaped CTAs" },
  "blue-pill-tags": { category: "visual-accent", name: "Blue Pill Tags" },
  "outline-buttons": { category: "visual-accent", name: "Outline Buttons" },
  "terminal-aesthetic": { category: "content-pattern", name: "Terminal Aesthetic" },
  "terminal-syntax-highlighting": { category: "content-pattern", name: "Terminal Syntax Highlighting" },
  "product-screenshot-hero": { category: "content-pattern", name: "Product Screenshot Hero" },
  "product-screenshot-showcase": { category: "content-pattern", name: "Product Screenshot Showcase" },
  "template-showcase-grid": { category: "content-pattern", name: "Template Showcase Grid" },
  "logo-wall-grid": { category: "content-pattern", name: "Logo Wall Grid" },
  "integration-logo-grid": { category: "content-pattern", name: "Integration Logo Grid" },
  "accordion-faq-dark": { category: "content-pattern", name: "Accordion FAQ (Dark)" },
  "workflow-preview-cards": { category: "content-pattern", name: "Workflow Preview Cards" },
  "testimonial-masonry": { category: "content-pattern", name: "Testimonial Masonry" },
  "stats-grid-display": { category: "content-pattern", name: "Stats Grid Display" },
  "data-visualization-cards": { category: "content-pattern", name: "Data Visualization Cards" },
  "bug-severity-visualization": { category: "content-pattern", name: "Bug Severity Visualization" },
  "hand-drawn-illustrations": { category: "illustration-system", name: "Hand-Drawn Illustrations" },
  "playful-character-scenes": { category: "illustration-system", name: "Playful Character Scenes" },
  "custom-line-art": { category: "illustration-system", name: "Custom Line Art" },
  "isometric-illustrations": { category: "illustration-system", name: "Isometric Illustrations" },
  "floating-3d-renders": { category: "3d-spatial", name: "Floating 3D Renders" },
  "ambient-lighting": { category: "3d-spatial", name: "Ambient Lighting" },
};

function classifyEffect(slug: string): MotifTag {
  const entry = TAXONOMY[slug];
  if (entry) return { slug, name: entry.name, category: entry.category };
  return {
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: "visual-accent",
  };
}

function classifyEffects(effects: string[] | Record<string, unknown>): MotifTag[] {
  if (Array.isArray(effects)) return effects.map(classifyEffect);
  return Object.keys(effects).map(classifyEffect);
}

function parseCategoriesFromString(raw: string): Category[] {
  const parts = raw.split(/[/,]/).map((s) => s.trim());
  const result = new Set<Category>();
  for (const part of parts) {
    for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
      if (part.includes(key)) {
        result.add(cat);
        break;
      }
    }
  }
  return result.size > 0 ? Array.from(result) : ["B2B SaaS"];
}

function parseEngagement(raw: string): number {
  const match = raw.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 5;
}

function parseTechStack(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

async function parseHuntIndex(): Promise<Map<string, HuntIndexEntry>> {
  const content = await readFile(HUNT_INDEX_PATH, "utf-8");
  const map = new Map<string, HuntIndexEntry>();

  const blocks = content.split(/^### /m).slice(1);

  for (const block of blocks) {
    const lines = block.split("\n");
    const header = lines[0].trim();
    const dateMatch = header.match(/^(\d{4}-\d{2}-\d{2})\s+-\s+(.+)$/);
    if (!dateMatch) continue;

    const date = dateMatch[1];
    const name = dateMatch[2].trim();

    const get = (key: string): string => {
      const line = lines.find((l) => l.includes(`**${key}:**`));
      if (!line) return "";
      const idx = line.indexOf(`**${key}:**`);
      return line.slice(idx + key.length + 6).trim();
    };

    const slugLine = get("Slug");
    if (!slugLine) continue;
    const slug = slugLine.replace(/^hunt-/, "").trim();
    const fullSlug = slugLine.trim();

    const categoryRaw = get("Category");
    const engagementRaw = get("Engagement");
    const techStackRaw = get("Tech Stack");
    const styleRaw = get("Style");

    const whyLine = lines.findIndex((l) => l.startsWith("**Why It Works:**"));
    const whyItWorks = whyLine >= 0
      ? lines[whyLine].replace(/\*\*Why It Works:\*\*\s*/, "").trim()
      : "";

    let mode: PaletteMode = "light";
    if (DARK_MODE_HUNTS.has(fullSlug)) mode = "dark";
    else if (WARM_MODE_HUNTS.has(fullSlug)) mode = "warm";

    map.set(fullSlug, {
      slug,
      name,
      style: styleRaw,
      categories: parseCategoriesFromString(categoryRaw),
      engagement: parseEngagement(engagementRaw),
      mode,
      whyItWorks,
      techStack: parseTechStack(techStackRaw),
      date,
    });
  }

  return map;
}

function isVariantB(tokens: Record<string, unknown>): boolean {
  const colors = tokens.colors as Record<string, unknown> | undefined;
  if (!colors) return false;
  return (
    "primary" in colors ||
    "background" in colors && typeof (colors as Record<string, unknown>).background === "string"
  );
}

function normalizeVariantA(tokens: Record<string, unknown>): NormalizedTokens {
  const colors = (tokens.colors ?? {}) as {
    background?: Record<string, string>;
    accent?: Record<string, string>;
    text?: Record<string, string>;
  };
  const typography = (tokens.typography ?? {}) as {
    fontFamily?: { display?: string; body?: string; mono?: string };
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, number>;
    lineHeight?: Record<string, number>;
  };
  const shadow = (tokens.shadow ?? tokens.shadows ?? {}) as Record<string, string>;
  const animation = (tokens.animation ?? {}) as {
    duration?: Record<string, string>;
    easing?: Record<string, string>;
  };

  return {
    colors: {
      background: colors.background ?? {},
      accent: colors.accent ?? {},
      text: colors.text ?? {},
    },
    typography: {
      families: {
        display: typography.fontFamily?.display ?? "",
        body: typography.fontFamily?.body ?? "",
        mono: typography.fontFamily?.mono,
      },
      scale: typography.fontSize ?? {},
      weights: typography.fontWeight ?? {},
      lineHeights: typography.lineHeight ?? {},
    },
    spacing: (tokens.spacing ?? {}) as Record<string, string>,
    borderRadius: (tokens.borderRadius ?? {}) as Record<string, string>,
    shadows: shadow,
    animation: {
      durations: animation.duration ?? {},
      easings: animation.easing ?? {},
    },
  };
}

function normalizeVariantB(tokens: Record<string, unknown>): NormalizedTokens {
  const flatColors = (tokens.colors ?? {}) as Record<string, string>;

  const background: Record<string, string> = {};
  const accent: Record<string, string> = {};
  const text: Record<string, string> = {};

  for (const [key, val] of Object.entries(flatColors)) {
    if (typeof val !== "string") continue;
    const lower = key.toLowerCase();
    if (lower.includes("background") || lower === "bg" || lower.includes("alt")) {
      background[key] = val;
    } else if (lower.includes("text") || lower === "black" || lower === "white") {
      text[key] = val;
    } else {
      accent[key] = val;
    }
  }

  const typography = (tokens.typography ?? {}) as {
    fonts?: Record<string, { family?: string; weights?: number[]; source?: string }>;
    sizes?: Record<string, string>;
    fontWeights?: Record<string, number>;
    lineHeights?: Record<string, string>;
  };

  const fonts = typography.fonts ?? {};
  const lineHeightsRaw = typography.lineHeights ?? {};
  const lineHeights: Record<string, number> = {};
  for (const [k, v] of Object.entries(lineHeightsRaw)) {
    lineHeights[k] = parseFloat(String(v));
  }

  const animations = (tokens.animations ?? {}) as {
    duration?: Record<string, string>;
    easing?: Record<string, string>;
  };

  return {
    colors: { background, accent, text },
    typography: {
      families: {
        display: fonts.display?.family ?? "",
        body: fonts.body?.family ?? "",
        mono: fonts.mono?.family,
      },
      scale: typography.sizes ?? {},
      weights: typography.fontWeights ?? {},
      lineHeights,
    },
    spacing: (tokens.spacing ?? {}) as Record<string, string>,
    borderRadius: (tokens.borderRadius ?? {}) as Record<string, string>,
    shadows: (tokens.shadows ?? {}) as Record<string, string>,
    animation: {
      durations: animations.duration ?? {},
      easings: animations.easing ?? {},
    },
  };
}

function extractCoreAesthetic(markdownContent: string): string {
  const patterns = [
    /##\s+1\.\s+Core Aesthetic\s*\n+([\s\S]*?)(?=\n##\s|\n---|\n#\s|$)/i,
    /##\s+Core Aesthetic[:\s]*\n+([\s\S]*?)(?=\n##\s|\n---|\n#\s|$)/i,
  ];

  for (const pattern of patterns) {
    const match = markdownContent.match(pattern);
    if (match) {
      return match[1]
        .replace(/\*\*[^*]+\*\*/g, (m) => m.slice(2, -2))
        .replace(/^[*\-]\s+/gm, "")
        .replace(/\n{2,}/g, "\n")
        .trim()
        .slice(0, 500);
    }
  }
  return "";
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function processHuntFolder(
  huntDir: string,
  dateStr: string,
  huntIndexMap: Map<string, HuntIndexEntry>
): Promise<Motif | null> {
  const huntDirName = basename(huntDir);
  const indexEntry = huntIndexMap.get(huntDirName);

  const tokensPath = join(huntDir, "design-tokens.json");
  if (!(await fileExists(tokensPath))) {
    console.warn(`  Skipping ${huntDirName}: no design-tokens.json`);
    return null;
  }

  let rawTokens: Record<string, unknown>;
  try {
    const content = await readFile(tokensPath, "utf-8");
    rawTokens = JSON.parse(content) as Record<string, unknown>;
  } catch {
    console.warn(`  Skipping ${huntDirName}: failed to parse design-tokens.json`);
    return null;
  }

  const slug = huntDirName;
  const name = indexEntry?.name ?? huntDirName.replace(/^hunt-/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const huntDate = indexEntry?.date ?? dateStr;

  const variantB = isVariantB(rawTokens);
  const tokens = variantB ? normalizeVariantB(rawTokens) : normalizeVariantA(rawTokens);

  const rawEffects = rawTokens.effects as string[] | Record<string, unknown> | undefined;
  const motifTags: MotifTag[] = rawEffects ? classifyEffects(rawEffects) : [];

  let coreAesthetic = "";
  const visualRefPath = join(huntDir, "visual-reference.md");
  if (await fileExists(visualRefPath)) {
    const vr = await readFile(visualRefPath, "utf-8");
    coreAesthetic = extractCoreAesthetic(vr);
  }

  let whyItWorks = indexEntry?.whyItWorks ?? "";
  const whyPath = join(huntDir, "why-it-works.md");
  if (!whyItWorks && (await fileExists(whyPath))) {
    const wy = await readFile(whyPath, "utf-8");
    whyItWorks = wy.replace(/^#.*\n/m, "").trim().slice(0, 500);
  }

  const destDir = join(OUT_PUBLIC_DIR, slug);
  await mkdir(destDir, { recursive: true });

  const screenshots: Motif["screenshots"] = { desktop: "" };
  const screenshotFiles = await readdir(huntDir).then((files) =>
    files.filter((f) => f.startsWith("reference-") && f.endsWith(".png"))
  ).catch(() => [] as string[]);

  for (const file of screenshotFiles) {
    const src = join(huntDir, file);
    const dest = join(destDir, file);
    await copyFile(src, dest);
    const publicPath = `/motifs/${slug}/${file}`;
    if (file.includes("desktop")) screenshots.desktop = publicPath;
    else if (file.includes("tablet")) screenshots.tablet = publicPath;
    else if (file.includes("mobile")) screenshots.mobile = publicPath;
  }

  if (!screenshots.desktop && screenshotFiles.length > 0) {
    screenshots.desktop = `/motifs/${slug}/${screenshotFiles[0]}`;
  }

  return {
    slug,
    name,
    style: indexEntry?.style ?? "",
    huntDate,
    categories: indexEntry?.categories ?? ["B2B SaaS"],
    engagement: indexEntry?.engagement ?? 5,
    mode: indexEntry?.mode ?? "light",
    tokens,
    motifs: motifTags,
    whyItWorks,
    coreAesthetic,
    techStack: indexEntry?.techStack ?? [],
    screenshots,
  };
}

async function main() {
  console.log("Building hunt index from vault...");
  const huntIndexMap = await parseHuntIndex();
  console.log(`  Parsed ${huntIndexMap.size} entries from hunt-library-index.md`);

  await mkdir(OUT_CONTENT_DIR, { recursive: true });
  await mkdir(OUT_PUBLIC_DIR, { recursive: true });

  const dateDirs = await readdir(TEMPLATES_ROOT).catch(() => [] as string[]);
  const motifs: Motif[] = [];

  for (const dateDir of dateDirs.sort()) {
    const datePath = join(TEMPLATES_ROOT, dateDir);
    let entries: string[];
    try {
      entries = await readdir(datePath);
    } catch {
      continue;
    }

    const huntDirs = entries.filter((e) => e.startsWith("hunt-"));
    for (const huntName of huntDirs) {
      const huntPath = join(datePath, huntName);
      console.log(`Processing ${dateDir}/${huntName}...`);
      const motif = await processHuntFolder(huntPath, dateDir, huntIndexMap);
      if (motif) {
        motifs.push(motif);
        const individualPath = join(OUT_CONTENT_DIR, `${motif.slug}.json`);
        await writeFile(individualPath, JSON.stringify(motif, null, 2), "utf-8");
        console.log(`  Written: ${motif.slug}.json`);
      }
    }
  }

  const indexPath = join(OUT_CONTENT_DIR, "index.json");
  await writeFile(indexPath, JSON.stringify(motifs, null, 2), "utf-8");

  console.log(`\nDone. ${motifs.length} motifs written to:`);
  console.log(`  ${OUT_CONTENT_DIR}/index.json`);
  console.log(`  ${OUT_CONTENT_DIR}/{slug}.json`);
  console.log(`  ${OUT_PUBLIC_DIR}/{slug}/*.png`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
