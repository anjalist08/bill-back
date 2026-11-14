import type { AnalyzeResult } from "./schemas";
import { money } from "./format";

export type LetterInput = {
  result: AnalyzeResult;
  issueIds?: string[];
  patientName?: string;
};

/** Deterministic letter used when Gemini is unavailable (and as the sample-mode letter). */
export function buildFallbackLetter({ result, issueIds, patientName }: LetterInput): string {
  const { extraction, analysis } = result;
  const issues = analysis.issues.filter((i) => !issueIds || issueIds.includes(i.id));
  const total = issues.reduce((s, i) => s + i.estimatedSavings, 0);
  const lines = issues.map(
    (i, n) =>
      `${n + 1}. ${i.title} (${money(i.estimatedSavings)})\n   ${i.explanation}\n   Requested action: ${i.suggestedAction}`,
  );
  return `[Date]

${extraction.providerName ?? "[Provider billing department]"}
Billing Department

RE: Request for billing review and itemized statement
Account number: ${extraction.accountNumber ?? "[account number]"}
Patient: ${patientName || extraction.patientName || "[patient name]"}

To whom it may concern,

I am writing to dispute several charges on the statement above, totaling ${money(extraction.totalBilled)}. After reviewing it, I believe the following items may be billed in error:

${lines.join("\n\n")}

Taken together, these items account for approximately ${money(total)}. Please:
- send a fully itemized statement with procedure codes,
- review each item above and correct or remove any charge billed in error,
- place my account on hold, with no collections activity, while this review is open, and
- send me a written response with the outcome.

Thank you for your prompt attention.

Sincerely,
${patientName || extraction.patientName || "[patient name]"}
[Phone / email]

This letter was drafted with BillBack and identifies potential billing issues. It is not legal advice.`;
}
