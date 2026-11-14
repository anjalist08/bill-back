import { callGeminiJson } from "./gemini";
import { AnalysisSchema, type Analysis, type Extraction } from "./schemas";

const SYSTEM = `You are a careful medical billing auditor helping a patient dispute errors.
You find POTENTIAL issues only. You are not giving legal or medical advice.
Be specific and honest: if you are unsure, lower the confidence. Never fabricate billing rules or codes.
Return ONLY valid JSON.`;

function buildPrompt(extraction: Extraction): string {
  const numbered = extraction.lineItems.map((item, i) => ({ index: i, ...item }));
  return `Review this extracted bill for issues a patient could dispute.

Document type: ${extraction.documentType}
Total billed: ${extraction.totalBilled}
Denial reason (if any): ${extraction.denialReason ?? "none"}
Line items (with 0-based index):
${JSON.stringify(numbered, null, 2)}

Look for:
- duplicate charges for the same service/date
- unbundling or upcoding suspicion (separate charges that are normally included together, or a code that seems higher-level than the description)
- charges that do not match the described service
- arithmetic errors (line items not summing to the total)
- unusually high amounts versus typical ranges
- denial reasons that look appealable (missing info, coding errors, prior-auth technicalities)

Return JSON with exactly this shape:
{
  "summary": string,              // 1-2 plain-English sentences
  "estimatedSavings": number,     // sum of realistic savings across issues, in USD
  "issues": [
    {
      "id": string,               // short unique id like "dup-1"
      "title": string,
      "severity": "high" | "medium" | "low",
      "lineItemRefs": number[],   // indexes from the list above
      "explanation": string,      // plain English, why this looks wrong
      "estimatedSavings": number, // USD for this issue
      "confidence": number,       // 0 to 1
      "suggestedAction": string   // what the patient should ask for
    }
  ]
}
Order issues from highest to lowest potential savings. If you find nothing, return an empty issues array and estimatedSavings 0.`;
}

export async function analyzeExtraction(extraction: Extraction): Promise<Analysis> {
  const analysis = await callGeminiJson({
    system: SYSTEM,
    prompt: buildPrompt(extraction),
    schema: AnalysisSchema,
  });
  // Keep the headline number consistent with the listed issues.
  const sum = analysis.issues.reduce((s, i) => s + i.estimatedSavings, 0);
  return { ...analysis, estimatedSavings: Math.round(sum * 100) / 100 };
}
