import { NextRequest, NextResponse } from "next/server";
import { getMotifBySlug } from "@/lib/motifs";
import { exportTokens, type ExportFormat } from "@/lib/export-tokens";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const format = (request.nextUrl.searchParams.get("format") ?? "json") as ExportFormat;
  const motif = getMotifBySlug(slug);

  if (!motif) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const content = exportTokens(motif.tokens, format, motif.name);
  const contentType = format === "css" ? "text/css" : "application/json";

  return new NextResponse(content, {
    headers: { "Content-Type": contentType },
  });
}
