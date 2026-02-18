export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const s = delta / (1 - Math.abs(2 * l - 1));

  let h = 0;
  if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  return { h, s: s * 100, l: l * 100 };
}

export function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const toLinear = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(parseInt(clean.slice(0, 2), 16));
  const g = toLinear(parseInt(clean.slice(2, 4), 16));
  const b = toLinear(parseInt(clean.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface DNAStrand {
  colors: string[];
  huePositions: number[];
  lightnessPositions: number[];
  contrastPairs: { from: number; to: number; ratio: number }[];
}

export function generateDNAStrand(hexColors: string[]): DNAStrand {
  if (hexColors.length === 0) {
    return { colors: [], huePositions: [], lightnessPositions: [], contrastPairs: [] };
  }

  const hslValues = hexColors.map(hexToHSL);
  const huePositions = hslValues.map(({ h }) => h / 360);
  const lightnessPositions = hslValues.map(({ l }) => l / 100);

  const contrastPairs: { from: number; to: number; ratio: number }[] = [];
  for (let i = 0; i < hexColors.length; i++) {
    for (let j = i + 1; j < hexColors.length; j++) {
      const ratio = getContrastRatio(hexColors[i], hexColors[j]);
      if (ratio >= 3) {
        contrastPairs.push({ from: i, to: j, ratio });
      }
    }
  }

  return { colors: hexColors, huePositions, lightnessPositions, contrastPairs };
}
