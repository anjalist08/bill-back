import { GoogleGenAI } from "@google/genai";
import type { ZodType } from "zod";

const DEFAULT_MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  client ??= new GoogleGenAI({ apiKey });
  return client;
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
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const parts: Array<Record<string, unknown>> = [];
  if (opts.file) parts.push({ inlineData: opts.file });
  parts.push({ text: opts.prompt });

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await getClient().models.generateContent({
      model,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: opts.system,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
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
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const res = await getClient().models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { systemInstruction: system, temperature: 0.4 },
  });
  const text = (res.text ?? "").trim();
  if (!text) throw new Error("Gemini returned an empty letter");
  return text;
}
