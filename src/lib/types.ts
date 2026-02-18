export type Category =
  | "Portfolio"
  | "B2B SaaS"
  | "Dev Tools"
  | "VC / Finance"
  | "Creative / 3D"
  | "Education"
  | "Fintech";

export type MotifCategory =
  | "background-treatment"
  | "hover-interaction"
  | "entrance-animation"
  | "layout-pattern"
  | "visual-accent"
  | "content-pattern"
  | "illustration-system"
  | "3d-spatial";

export type PaletteMode = "dark" | "light" | "warm";

export interface MotifTag {
  slug: string;
  name: string;
  category: MotifCategory;
  cssHint?: string;
}

export interface NormalizedTokens {
  colors: {
    background: Record<string, string>;
    accent: Record<string, string>;
    text: Record<string, string>;
  };
  typography: {
    families: {
      display: string;
      body: string;
      mono?: string;
    };
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

export interface Motif {
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
  screenshots: {
    desktop: string;
    tablet?: string;
    mobile?: string;
  };
}
