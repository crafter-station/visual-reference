import type { EffectCategory, EffectTag } from "@/lib/types";

const TAXONOMY: Record<string, { category: EffectCategory; name: string }> = {
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

export function classifyEffect(slug: string): EffectTag {
  const entry = TAXONOMY[slug];
  if (entry) {
    return { slug, name: entry.name, category: entry.category };
  }
  return {
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: "visual-accent",
  };
}

export function classifyEffects(effects: string[] | Record<string, unknown>): EffectTag[] {
  if (Array.isArray(effects)) {
    return effects.map(classifyEffect);
  }
  return Object.keys(effects).map(classifyEffect);
}

export const EFFECT_CATEGORY_LABELS: Record<EffectCategory, string> = {
  "background-treatment": "Background Treatments",
  "hover-interaction": "Hover Interactions",
  "entrance-animation": "Entrance Animations",
  "layout-pattern": "Layout Patterns",
  "visual-accent": "Visual Accents",
  "content-pattern": "Content Patterns",
  "illustration-system": "Illustration Systems",
  "3d-spatial": "3D & Spatial",
};

export const EFFECT_CATEGORY_COLORS: Record<EffectCategory, string> = {
  "background-treatment": "#6366f1",
  "hover-interaction": "#f59e0b",
  "entrance-animation": "#10b981",
  "layout-pattern": "#3b82f6",
  "visual-accent": "#ec4899",
  "content-pattern": "#8b5cf6",
  "illustration-system": "#f97316",
  "3d-spatial": "#06b6d4",
};
