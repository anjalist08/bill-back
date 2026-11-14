import { z } from "zod";

export const LineItemSchema = z.object({
  code: z.string().nullish(),
  description: z.string(),
  amount: z.number(),
  date: z.string().nullish(),
  provider: z.string().nullish(),
});

export const ExtractionSchema = z.object({
  documentType: z.enum(["bill", "eob", "denial", "unknown"]),
  patientName: z.string().nullish(),
  providerName: z.string().nullish(),
  accountNumber: z.string().nullish(),
  payerName: z.string().nullish(),
  claimNumber: z.string().nullish(),
  totalBilled: z.number(),
  lineItems: z.array(LineItemSchema),
  denialReason: z.string().nullish(),
  notes: z.string().nullish(),
});

export const IssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: z.enum(["high", "medium", "low"]),
  lineItemRefs: z.array(z.number()),
  explanation: z.string(),
  estimatedSavings: z.number(),
  confidence: z.number().min(0).max(1),
  suggestedAction: z.string(),
});

export const AnalysisSchema = z.object({
  summary: z.string(),
  estimatedSavings: z.number(),
  issues: z.array(IssueSchema),
});

export type LineItem = z.infer<typeof LineItemSchema>;
export type Extraction = z.infer<typeof ExtractionSchema>;
export type Issue = z.infer<typeof IssueSchema>;
export type Analysis = z.infer<typeof AnalysisSchema>;

export type AnalyzeResult = {
  extraction: Extraction;
  analysis: Analysis;
};
