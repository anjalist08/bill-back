import { callGeminiJson } from "./gemini";
import { AnalysisSchema, type Analysis, type Extraction, type Issue } from "./schemas";

const SYSTEM = `You are a careful medical billing auditor helping a patient dispute errors.
You find POTENTIAL issues only. You are not giving legal or medical advice.
Be specific and honest: if you are unsure, lower the confidence. Never fabricate billing rules or codes.
Return ONLY valid JSON.`;

function buildPrompt(extraction: Extraction): string {
  const numbered = extraction.lineItems.map((item, i) => ({ index: i, ...item }));
  return `Review this extracted bill for issues a patient could dispute.

Document type: ${extraction.documentType}
Total billed (as printed): ${extraction.totalBilled}
Sum of line items (computed): ${round2(sumItems(extraction))}
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
Rules: only reference codes and amounts that appear in the list above; never invent codes. For a denial, estimatedSavings is only the amount that could be recovered IF an appeal succeeds, and confidence must not exceed 0.6. Do not report a total mismatch yourself; it is checked separately.
Order issues from highest to lowest potential savings. If you find nothing, return an empty issues array and estimatedSavings 0.`;
}

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const round2 = (n: number) => Math.round(n * 100) / 100;
const sumItems = (e: Extraction) => e.lineItems.reduce((s, i) => s + i.amount, 0);

/** Clean up model output and add deterministic checks the model can miss. */
export function postProcess(extraction: Extraction, analysis: Analysis): Analysis {
  const n = extraction.lineItems.length;
  const isDenial = extraction.documentType === "denial" || Boolean(extraction.denialReason);
  const issues: Issue[] = analysis.issues
    .filter((i) => i.lineItemRefs.every((r) => Number.isInteger(r) && r >= 0 && r < n))
    .map((i) => {
      const refTotal = i.lineItemRefs.reduce((s, r) => s + extraction.lineItems[r].amount, 0);
      const cap = i.lineItemRefs.length ? refTotal : Infinity;
      return {
        ...i,
        estimatedSavings: round2(Math.max(0, Math.min(i.estimatedSavings, cap))),
        confidence: isDenial ? Math.min(i.confidence, 0.6) : i.confidence,
      };
    });

  // Printed total vs. sum of line items: pure arithmetic, so never left to the model.
  const diff = round2(extraction.totalBilled - sumItems(extraction));
  // The model sometimes reports the mismatch itself despite the prompt; drop those so the
  // amount is not counted twice next to the deterministic issue below.
  const TOTAL_TOPIC = /\b(total|sum|math|arithmetic|mismatch|discrepanc\w*|add(s|ed)? up)\b/i;
  for (let k = issues.length - 1; k >= 0; k--) {
    const i = issues[k];
    const coversWholeBill = i.lineItemRefs.length === 0 || i.lineItemRefs.length === n;
    const aboutTotal = TOTAL_TOPIC.test(i.title) && coversWholeBill;
    const sameAmount = Math.abs(diff) >= 0.01 && i.lineItemRefs.length === 0 && Math.abs(i.estimatedSavings - Math.abs(diff)) < 1;
    if (aboutTotal || sameAmount) issues.splice(k, 1);
  }
  if (n > 0 && Math.abs(diff) >= 0.01) {
    const over = diff > 0;
    issues.push({
      id: "total-mismatch",
      title: over ? "Printed total is higher than the line items" : "Printed total is lower than the line items",
      severity: over ? "high" : "low",
      lineItemRefs: [],
      explanation: `The document shows a total of ${usd(extraction.totalBilled)}, but the listed charges add up to ${usd(sumItems(extraction))}, a difference of ${usd(Math.abs(diff))}. This may be a math error or an unlisted charge.`,
      estimatedSavings: over ? diff : 0,
      confidence: 0.9,
      suggestedAction: "Ask the billing office for a fully itemized statement that explains the difference.",
    });
  }
  issues.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
  const total = round2(issues.reduce((s, i) => s + i.estimatedSavings, 0));
  return { ...analysis, issues, estimatedSavings: total };
}

export async function analyzeExtraction(extraction: Extraction): Promise<Analysis> {
  const analysis = await callGeminiJson({
    system: SYSTEM,
    prompt: buildPrompt(extraction),
    schema: AnalysisSchema,
  });
  return postProcess(extraction, analysis);
}
