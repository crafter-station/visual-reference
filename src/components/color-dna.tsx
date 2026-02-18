"use client";

import { useEffect, useRef } from "react";
import { generateDNAStrand } from "@/lib/color-analysis";

interface ColorDNAProps {
  colors: string[];
  width?: number;
  height?: number;
  animated?: boolean;
  className?: string;
}

export function ColorDNA({
  colors,
  width = 200,
  height = 48,
  animated = true,
  className,
}: ColorDNAProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const rafRef = useRef<number>(0);
  const mouseXRef = useRef(0.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const shouldAnimate = animated && !prefersReducedMotion;

    const strand = generateDNAStrand(colors);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = (e.clientX - rect.left) / rect.width;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const amplitude = height * 0.28;
    const centerY = height / 2;
    const frequency = (2 * Math.PI) / width;
    const steps = width * 1.5;

    const draw = (phase: number) => {
      ctx.clearRect(0, 0, width, height);

      const mouseInfluence = (mouseXRef.current - 0.5) * 0.4;
      const effectivePhase = phase + mouseInfluence;

      // Draw strand lines
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * width;
        const y = centerY + amplitude * Math.sin(effectivePhase + x * frequency);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * width;
        const y =
          centerY +
          amplitude * Math.sin(effectivePhase + x * frequency + Math.PI);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (strand.colors.length === 0) return;

      // Place nucleotides evenly along the strand
      const count = strand.colors.length;
      const padding = width * 0.08;
      const usableWidth = width - padding * 2;

      // Draw cross-bars first (behind nucleotides)
      for (const pair of strand.contrastPairs) {
        if (pair.from >= count || pair.to >= count) continue;
        const xFrom =
          padding + (pair.from / Math.max(count - 1, 1)) * usableWidth;
        const xTo = padding + (pair.to / Math.max(count - 1, 1)) * usableWidth;

        const y1From =
          centerY + amplitude * Math.sin(effectivePhase + xFrom * frequency);
        const y2From =
          centerY +
          amplitude * Math.sin(effectivePhase + xFrom * frequency + Math.PI);
        const y1To =
          centerY + amplitude * Math.sin(effectivePhase + xTo * frequency);
        const y2To =
          centerY +
          amplitude * Math.sin(effectivePhase + xTo * frequency + Math.PI);

        const opacity = Math.min((pair.ratio - 3) / 18, 1) * 0.25;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(xFrom, y1From);
        ctx.lineTo(xTo, y1To);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(xFrom, y2From);
        ctx.lineTo(xTo, y2To);
        ctx.stroke();
      }

      const nodeRadius = Math.max(2.5, Math.min(height * 0.08, 5));

      for (let i = 0; i < count; i++) {
        const x = padding + (i / Math.max(count - 1, 1)) * usableWidth;
        const hex = strand.colors[i];

        const y1 =
          centerY + amplitude * Math.sin(effectivePhase + x * frequency);
        const y2 =
          centerY +
          amplitude * Math.sin(effectivePhase + x * frequency + Math.PI);

        // Cross-bar between paired nucleotides
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 0.75;
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();

        // Top nucleotide
        ctx.beginPath();
        ctx.arc(x, y1, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = hex;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Bottom nucleotide (lightness complement)
        const lightness = strand.lightnessPositions[i] ?? 0.5;
        const complementL = 1 - lightness;
        const alpha = 0.4 + complementL * 0.4;
        ctx.beginPath();
        ctx.arc(x, y2, nodeRadius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
    };

    if (shouldAnimate) {
      const tick = () => {
        phaseRef.current += 0.008;
        draw(phaseRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      draw(0);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [colors, width, height, animated]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className={className}
    />
  );
}
