import type { AnalyzeResult } from "./schemas";

/** Fully synthetic sample. No real patient or provider data. */
export const SAMPLE_RESULT: AnalyzeResult = {
  extraction: {
    documentType: "bill",
    patientName: "Sample Patient",
    providerName: "Example Regional Hospital (fictional)",
    accountNumber: "SAMPLE-0001",
    totalBilled: 5455,
    denialReason: null,
    lineItems: [
      { code: "99285", description: "Emergency dept visit, high severity", amount: 2850, date: "2026-09-12", provider: "Example Regional Hospital" },
      { code: "85025", description: "Complete blood count (CBC)", amount: 185, date: "2026-09-12", provider: "Example Regional Hospital" },
      { code: "85025", description: "Complete blood count (CBC)", amount: 185, date: "2026-09-12", provider: "Example Regional Hospital" },
      { code: "71046", description: "Chest X-ray, 2 views", amount: 620, date: "2026-09-12", provider: "Example Regional Hospital" },
      { code: "96365", description: "IV infusion, initial hour", amount: 940, date: "2026-09-12", provider: "Example Regional Hospital" },
      { code: "96374", description: "IV push, single drug", amount: 410, date: "2026-09-12", provider: "Example Regional Hospital" },
      { code: null, description: "Miscellaneous supplies", amount: 265, date: "2026-09-12", provider: "Example Regional Hospital" },
    ],
  },
  analysis: {
    summary:
      "We found 4 potential issues worth disputing, including a duplicate lab charge and a possibly over-coded emergency visit.",
    estimatedSavings: 1760,
    issues: [
      {
        id: "upcode-1",
        title: "Emergency visit may be over-coded",
        severity: "high",
        lineItemRefs: [0],
        explanation:
          "Code 99285 is the highest emergency severity level. The services listed (basic labs, a chest X-ray, one IV) are more typical of a mid-level visit.",
        estimatedSavings: 900,
        confidence: 0.6,
        suggestedAction: "Request the chart documentation supporting level 5 and ask for a coding review.",
      },
      {
        id: "dup-1",
        title: "Duplicate blood count charge",
        severity: "high",
        lineItemRefs: [1, 2],
        explanation: "The same CBC (85025) is billed twice on the same date with identical amounts and no explanation.",
        estimatedSavings: 185,
        confidence: 0.85,
        suggestedAction: "Ask for one of the two charges to be removed unless a repeat test was ordered.",
      },
      {
        id: "supplies-1",
        title: "Supplies billed separately",
        severity: "medium",
        lineItemRefs: [6],
        explanation: "Routine supplies are normally included in the facility fee and should not be an extra line item.",
        estimatedSavings: 265,
        confidence: 0.55,
        suggestedAction: "Ask for an itemized breakdown and removal of routine supplies.",
      },
      {
        id: "iv-1",
        title: "IV push billed alongside an infusion",
        severity: "medium",
        lineItemRefs: [4, 5],
        explanation: "An IV push given during the same infusion session is often not separately billable.",
        estimatedSavings: 410,
        confidence: 0.5,
        suggestedAction: "Ask whether the push was a distinct service, and request removal if it was not.",
      },
    ],
  },
};
