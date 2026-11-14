import { GoogleGenAI } from "@google/genai";
import type { ZodType } from "zod";

const DEFAULT_MODEL = "gemini-flash-lite-latest";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

const FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest"];

function isTransient(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /"code":\s*(429|500|502|503|504)|UNAVAILABLE|RESOURCE_EXHAUSTED|fetch failed/i.test(msg);
}

/** Try the primary model, retrying transient errors, then fall back to other models. */
async function generate(config: Record<string, unknown>, contents: unknown) {
  const primary = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const models = [primary, ...FALLBACK_MODELS.filter((m) => m !== primary)];
  let lastError: unknown;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await getClient().models.generateContent({ model, contents: contents as never, config });
      } catch (err) {
        lastError = err;
        if (!isTransient(err)) throw err;
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export type InlineFile = { mimeType: string; data: string };

type JsonCallOptions<T> = {
  system: string;
  prompt: string;
  schema: ZodType<T>;
  file?: InlineFile;
};

/** Strip ```json fences if the model adds them. */
function cleanJson(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

/**
 * Call Gemini expecting JSON, validate with Zod, retry once on bad output.
 */
export async function callGeminiJson<T>(opts: JsonCallOptions<T>): Promise<T> {
  const parts: Array<Record<string, unknown>> = [];
  if (opts.file) parts.push({ inlineData: opts.file });
  parts.push({ text: opts.prompt });

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await generate(
      { systemInstruction: opts.system, responseMimeType: "application/json", temperature: 0.2 },
      [{ role: "user", parts }],
    );
    try {
      const raw = JSON.parse(cleanJson(res.text ?? ""));
      return opts.schema.parse(raw);
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`Gemini returned invalid JSON: ${String(lastError)}`);
}

/** Plain-text Gemini call (used for the dispute letter). */
export async function callGeminiText(system: string, prompt: string): Promise<string> {
  const res = await generate({ systemInstruction: system, temperature: 0.4 }, [
    { role: "user", parts: [{ text: prompt }] },
  ]);
  const text = (res.text ?? "").trim();
  if (!text) throw new Error("Gemini returned an empty letter");
  return text;
}
