import { NextResponse } from "next/server";
import { analyzeExtraction } from "@/lib/analyze";
import { extractDocument } from "@/lib/extract";
import type { AnalyzeResult } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/heic", "application/pdf"]);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Attach a bill as the 'file' field." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Use a PNG, JPG, WebP, HEIC image or a PDF." }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File is too large (10 MB max)." }, { status: 413 });
    }

    const data = Buffer.from(await file.arrayBuffer()).toString("base64");
    const extraction = await extractDocument({ mimeType: file.type, data });
    const analysis = await analyzeExtraction(extraction);

    const result: AnalyzeResult = { extraction, analysis };
    return NextResponse.json(result);
  } catch (err) {
    // Never log document contents; only the error message.
    console.error("analyze failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Could not analyze that document. Try a clearer photo." }, { status: 500 });
  }
}
