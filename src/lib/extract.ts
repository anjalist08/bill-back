import { callGeminiJson, type InlineFile } from "./gemini";
import { ExtractionSchema, type Extraction } from "./schemas";

const SYSTEM = `You extract structured data from medical bills, insurance Explanation of Benefits (EOB) statements, and insurance denial letters.
Return ONLY valid JSON. Never invent values: if something is not visible, use null.
Amounts are numbers in US dollars with no currency symbol.`;

const PROMPT = `Read the attached document and return JSON with exactly this shape:
{
  "documentType": "bill" | "eob" | "denial" | "unknown",
  "patientName": string | null,
  "providerName": string | null,
  "accountNumber": string | null,
  "payerName": string | null,   // insurance company / health plan, if shown
  "claimNumber": string | null,
  "totalBilled": number,
  "lineItems": [
    { "code": string | null, "description": string, "amount": number, "date": string | null, "provider": string | null }
  ],
  "denialReason": string | null,
  "notes": string | null   // other facts stated in the document: appeal deadlines, dates a prior-auth was submitted, etc. Quote, do not infer.
}
List every charge as its own line item, in the order shown. "code" is a CPT/HCPCS/revenue code if present.
"totalBilled" is the total amount billed on the document; if it is not printed, sum the line items.`;

export async function extractDocument(file: InlineFile): Promise<Extraction> {
  const out = await callGeminiJson({ system: SYSTEM, prompt: PROMPT, schema: ExtractionSchema, file });
  // Placeholder codes are not real codes; never present them as such.
  const PLACEHOLDER = /^(n\/?a|none|null|unknown|-*)$/i;
  const clean = (c?: string | null) => (c && !PLACEHOLDER.test(c.trim()) ? c.trim() : null);
  return { ...out, lineItems: out.lineItems.map((i) => ({ ...i, code: clean(i.code) })) };
}
