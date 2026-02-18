---
name: add-visual-reference
description: |
  Add a new visual reference to the project. Paste a screenshot and this skill extracts design tokens, generates the VisualReference JSON, saves all files, and verifies the build. PR-ready.
  Triggers: /add-visual-reference, "add reference", "new reference", "add visual reference"
---

# Add Visual Reference

Add a new visual reference to the visual-reference project. Self-contained — no vault or external pipeline needed.

## Prerequisites

- You are in the `visual-reference` project root
- The user provides a screenshot (paste or file path)

## Step 1: Analyze Screenshot

Look at the screenshot carefully. Extract:

### Colors
- **Background colors**: main bg, secondary bg, card bg, section alternates
- **Accent colors**: primary CTA, links, highlights, gradients
- **Text colors**: headings, body, muted/secondary text

Use hex values. Name them semantically (e.g., `"primary"`, `"surface"`, `"muted"`).

### Typography
- **Display font**: What typeface are headings using? (e.g., "Inter", "Geist", "GT Walsheim")
- **Body font**: What typeface is body text? (often same as display)
- **Mono font**: Is there monospace text? (code blocks, labels, stats)

### Effects (visual patterns)
Identify which effects are present from this taxonomy:

| Category | Effects |
|----------|---------|
| `background-treatment` | Starfield Background, Color Block Sections, Scroll-Driven Color Zones, Dark Premium Aesthetic, Alternating Dark/Cream, Dot Pattern Branding, Extreme Whitespace, Radical Whitespace, Philosophical Minimalism, Mesh Gradients |
| `hover-interaction` | Card Hover Lift, Button Hover Brightness, Hover Lift Animation, Card Float on Color |
| `entrance-animation` | Fade Up Entrance, Perspective Grid |
| `layout-pattern` | Masonry Grid, Diagonal Section Cuts, Side-by-Side Layout, Editorial Minimalism, High Contrast Sections, Dramatic Negative Space |
| `visual-accent` | Neon Glow (Subtle), Glass-Morphic Cards, Hairline Borders, Minimal Borders, Halftone Dot Pattern, Underline Emphasis, Arrow Motif, Pill-Shaped CTAs, Blue Pill Tags, Outline Buttons |
| `content-pattern` | Terminal Aesthetic, Terminal Syntax Highlighting, Product Screenshot Hero, Template Showcase Grid, Logo Wall Grid, Accordion FAQ (Dark), Workflow Preview Cards, Testimonial Masonry, Stats Grid Display, Data Visualization Cards |
| `illustration-system` | Hand-Drawn Illustrations, Playful Character Scenes, Custom Line Art, Isometric Illustrations |
| `3d-spatial` | Floating 3D Renders, Ambient Lighting |

If an effect is not in the taxonomy, create a new slug: `kebab-case-name` with category `visual-accent` as default.

### Mode
- `"dark"` — dark background, light text
- `"light"` — light/white background, dark text
- `"warm"` — warm/cream/beige background

### Style
One-line description of the design style (e.g., "Vercel-inspired dark dev tools aesthetic with monospace accents").

## Step 2: Ask the User

Confirm these details with the user before generating:

1. **Name**: Display name (e.g., "Hex Inc", "Plasticity AI")
2. **Source URL**: The website URL (optional)
3. **Categories**: One or more from: Portfolio, B2B SaaS, Dev Tools, VC / Finance, Creative / 3D, Education, Fintech
4. **Mode**: dark / light / warm (confirm your analysis)
5. **Style**: Confirm your one-liner or let them edit
6. **Effects**: Show your detected effects, let them add/remove

## Step 3: Generate Slug

Format: `hunt-{kebab-case-name}`

Examples:
- "Hex Inc" → `hunt-hex-inc`
- "Better Auth" → `hunt-better-auth`
- "United Drone Company" → `hunt-united-drone-company`

## Step 4: Save Screenshot

Save the screenshot to:
```
public/references/{slug}/reference-desktop.png
```

Create the directory first:
```bash
mkdir -p public/references/{slug}
```

If the user also provides tablet/mobile screenshots, save as:
- `reference-tablet.png`
- `reference-mobile.png`

## Step 5: Generate VisualReference JSON

Create `src/content/references/{slug}.json` with this exact schema:

```json
{
  "slug": "hunt-example",
  "name": "Example Site",
  "style": "One-line style description",
  "sourceUrl": "https://example.com",
  "huntDate": "2026-02-17",
  "categories": ["Dev Tools"],
  "engagement": 5,
  "mode": "dark",
  "tokens": {
    "colors": {
      "background": {
        "primary": "#0a0a0a",
        "secondary": "#111111"
      },
      "accent": {
        "primary": "#3b82f6",
        "secondary": "#8b5cf6"
      },
      "text": {
        "primary": "#ffffff",
        "secondary": "#a1a1aa",
        "muted": "#52525b"
      }
    },
    "typography": {
      "families": {
        "display": "Inter",
        "body": "Inter",
        "mono": "JetBrains Mono"
      },
      "scale": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem"
      },
      "weights": {
        "normal": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      },
      "lineHeights": {
        "tight": 1.25,
        "normal": 1.5,
        "relaxed": 1.75
      }
    },
    "spacing": {
      "xs": "0.25rem",
      "sm": "0.5rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem",
      "2xl": "3rem"
    },
    "borderRadius": {
      "sm": "0.25rem",
      "md": "0.5rem",
      "lg": "0.75rem",
      "full": "9999px"
    },
    "shadows": {
      "sm": "0 1px 2px rgba(0,0,0,0.05)",
      "md": "0 4px 6px rgba(0,0,0,0.1)"
    },
    "animation": {
      "durations": {
        "fast": "150ms",
        "normal": "300ms",
        "slow": "500ms"
      },
      "easings": {
        "default": "cubic-bezier(0.4, 0, 0.2, 1)",
        "in": "cubic-bezier(0.4, 0, 1, 1)",
        "out": "cubic-bezier(0, 0, 0.2, 1)"
      }
    }
  },
  "effects": [
    {
      "slug": "dark-premium-aesthetic",
      "name": "Dark Premium Aesthetic",
      "category": "background-treatment"
    },
    {
      "slug": "hairline-borders",
      "name": "Hairline Borders",
      "category": "visual-accent"
    }
  ],
  "whyItWorks": "Brief explanation of what makes this design effective.",
  "coreAesthetic": "Detailed description of the visual identity and design philosophy.",
  "techStack": ["Next.js", "Tailwind CSS", "Framer Motion"],
  "screenshots": {
    "desktop": "/references/hunt-example/reference-desktop.png"
  }
}
```

### Field Notes

- `huntDate`: Use today's date (YYYY-MM-DD)
- `engagement`: Default 5 (scale 1-10, higher = more visually striking)
- `effects`: Array of `{ slug, name, category }` objects. Use the taxonomy above for known effects. For new effects, use `kebab-case` slug and assign the closest category.
- `whyItWorks`: 1-2 sentences on what makes the design effective
- `coreAesthetic`: Longer description of the visual identity (up to 500 chars)
- `techStack`: Best guess from visual cues (e.g., "React" if SPA-like, "Tailwind" if utility-class patterns)
- `screenshots.desktop`: Path relative to `/public`

## Step 6: Update index.json

Read `src/content/references/index.json`, parse it, append the new reference, and write it back:

```typescript
const indexPath = "src/content/references/index.json";
const index = JSON.parse(await readFile(indexPath, "utf-8"));
index.push(newReference);
await writeFile(indexPath, JSON.stringify(index, null, 2));
```

## Step 7: Verify Build

```bash
bun run build
```

The build must pass with zero errors. If it fails, fix the JSON and retry.

## Step 8: Summary

Print what was created:

```
Added: {name} ({slug})

Files created:
  - public/references/{slug}/reference-desktop.png
  - src/content/references/{slug}.json
  - src/content/references/index.json (updated)

Build: passed

Next steps:
  git add public/references/{slug}/ src/content/references/{slug}.json src/content/references/index.json
  git commit -m "feat: add {name} visual reference"
  gh pr create --title "Add {name} visual reference" --body "New visual reference: {name} ({style})"
```
