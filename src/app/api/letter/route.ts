import { NextResponse } from "next/server";
import { z } from "zod";
import { callGeminiText } from "@/lib/gemini";
import { buildFallbackLetter } from "@/lib/letter";
import { AnalysisSchema, ExtractionSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

const BodySchema = z.object({
  extraction: ExtractionSchema,
  analysis: AnalysisSchema,
  issueIds: z.array(z.string()).optional(),
  patientName: z.string().max(120).optional(),
});

const SYSTEM = `You write clear, polite, firm patient letters disputing medical billing errors.
Be specific, cite line items and amounts, and request itemized statements, corrections and a collections hold.
Never claim certainty about errors: say "appears" or "may". Do not give legal advice.
Output only the letter text, ready to copy, with [bracketed] placeholders for unknown details.`;

export async function POST(req: Request) {
  let parsed: z.infer<typeof BodySchema>;
  try {
    parsed = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = { result: { extraction: parsed.extraction, analysis: parsed.analysis }, issueIds: parsed.issueIds, patientName: parsed.patientName };

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ letter: buildFallbackLetter(input), source: "template" });
  }
  try {
    const issues = parsed.analysis.issues.filter((i) => !parsed.issueIds || parsed.issueIds.includes(i.id));
    const prompt = `Write the dispute letter.
Provider: ${parsed.extraction.providerName ?? "unknown"}
Account number: ${parsed.extraction.accountNumber ?? "unknown"}
Patient: ${parsed.patientName || parsed.extraction.patientName || "unknown"}
Total billed: ${parsed.extraction.totalBilled}
Issues to include:
${JSON.stringify(issues, null, 2)}`;
    const letter = await callGeminiText(SYSTEM, prompt);
    return NextResponse.json({ letter, source: "gemini" });
  } catch (err) {
    console.error("letter failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ letter: buildFallbackLetter(input), source: "template" });
  }
}
