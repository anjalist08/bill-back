import { NextResponse } from "next/server";
import { callGeminiText } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment self-check: reports whether a Gemini key is configured and whether a
 * tiny Gemini call succeeds. Never returns the key itself, only an error summary.
 */
export async function GET() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY?.trim());
  const model = process.env.GEMINI_MODEL || "default";
  if (!hasKey) return NextResponse.json({ ok: false, hasKey, model, error: "GEMINI_API_KEY is not set" });
  try {
    await callGeminiText("Reply with the single word OK.", "ping");
    return NextResponse.json({ ok: true, hasKey, model });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const code = msg.match(/"code":\s*(\d{3})/)?.[1] ?? null;
    const status = msg.match(/"status":\s*"([A-Z_]+)"/)?.[1] ?? null;
    const reason = msg.match(/"reason":\s*"([A-Z_]+)"/)?.[1] ?? null;
    return NextResponse.json({ ok: false, hasKey, model, code, status, reason });
  }
}
