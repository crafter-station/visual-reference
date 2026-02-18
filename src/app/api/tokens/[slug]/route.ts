import { NextRequest, NextResponse } from "next/server";
import { getReferenceBySlug } from "@/lib/references";
import { exportTokens, type ExportFormat } from "@/lib/export-tokens";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const format = (request.nextUrl.searchParams.get("format") ?? "json") as ExportFormat;
  const ref = getReferenceBySlug(slug);

  if (!ref) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const content = exportTokens(ref.tokens, format, ref.name);
  const contentType = format === "css" ? "text/css" : "application/json";

  return new NextResponse(content, {
    headers: { "Content-Type": contentType },
  });
}
