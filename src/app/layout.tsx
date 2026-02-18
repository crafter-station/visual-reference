import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Motif Library — visual-reference.crafter.run",
  description:
    "Browse, compare, and export design tokens from real-world sites. Named visual behaviors with psychological justification.",
  openGraph: {
    title: "Motif Library",
    description: "Design tokens from real-world sites",
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
        <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium text-white">
                visual-reference
              </span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/50">
                .crafter.run
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/motifs"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                Motifs
              </Link>
              <Link
                href="/effects"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                Effects
              </Link>
              <Link
                href="/compare"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                Compare
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
