import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visual Reference — visual-reference.crafter.run",
  description:
    "Browse, compare, and copy design tokens from real-world sites. Prompt-first visual systems for AI coding tools.",
  openGraph: {
    title: "Visual Reference",
    description: "Prompt-first design tokens from real-world sites",
    url: "https://visual-reference.crafter.run",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2.5">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="font-mono text-[13px] font-medium text-white/80">
                visual-reference
              </span>
              <span className="font-mono text-[10px] text-white/25">
                .crafter.run
              </span>
            </Link>
            <div className="flex items-center gap-5">
              <Link
                href="/references"
                className="font-mono text-[12px] text-white/40 transition-colors hover:text-white/70"
              >
                browse
              </Link>
              <Link
                href="/effects"
                className="font-mono text-[12px] text-white/40 transition-colors hover:text-white/70"
              >
                effects
              </Link>
              <Link
                href="/compare"
                className="font-mono text-[12px] text-white/40 transition-colors hover:text-white/70"
              >
                compare
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
