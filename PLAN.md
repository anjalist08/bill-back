# BillBack — Build Plan

**One-liner:** Upload a medical bill or insurance denial. Gemini finds the errors, cites the rules, estimates your savings, and drafts the dispute letter — in about 60 seconds.

**Hackathon:** Berkeley x DeepMind (Nov 14). Track: **Google AI Studio** (Gemini API, deployed on Cloud Run).
**Hard deadline: 10:30 AM PT submission.**

---

## 1. Why this idea

| Judging criterion | How BillBack scores |
|---|---|
| Technical feasibility | Single-purpose pipeline: upload -> Gemini multimodal extraction -> structured analysis -> letter. Few moving parts. |
| Innovation | Multimodal (photo/PDF of messy bills) + structured output + grounded rules, not a chatbot. |
| Real-world applicability | Medical billing errors are common; the cost to a user is large and personal. |
| Market / fundability | Success-fee model (% of savings recovered); B2C wedge, B2B2C via employers, benefits platforms, insurers' members. |
| Go-to-market traction | Demo video has a built-in hook: "$X found in 60 seconds." Shareable result card. |

## 2. Product scope

### MVP (must ship by deadline)
1. Upload a bill / EOB / denial letter (image or PDF), or tap "Try a sample bill".
2. Gemini extracts line items (code, description, amount, date, provider).
3. Gemini analyzes them for issues: duplicate charges, upcoding / unbundling suspicion, charges inconsistent with the stated service, math errors, missing adjustments, denial reasons that look appealable.
4. UI shows: total billed, **estimated potential savings**, a ranked issue list with severity and plain-English explanation.
5. One click generates a **dispute / appeal letter** (copyable, downloadable).
6. Shareable "savings card" (for the traction metric).

### Stretch (only if MVP is done and deployed)
- Live voice "call script" for the billing department (Gemini Live).
- Multi-document case (bill + EOB + denial together).
- Email/print-ready PDF letter.
- Anonymous saved cases.

### Explicit non-goals
- No accounts, no database for MVP (stateless; files are processed in memory and not stored).
- Not legal or medical advice. Disclaimer is shown in the UI and in the letter footer.

## 3. Architecture

```
Browser (Next.js, React)
   |  multipart upload (image/PDF)
   v
Next.js Route Handler  /api/analyze  --(Gemini API, structured JSON)-->  Gemini
   |                                 \--(extract -> analyze, 2 calls)
   v
JSON result  -> UI (issues, savings, letter)
Next.js Route Handler  /api/letter   --(Gemini API)--> Gemini
```

- **Framework:** Next.js (App Router) + TypeScript, `output: "standalone"` for a small container.
- **AI:** `@google/genai` SDK. Model is configurable via `GEMINI_MODEL` (default `gemini-2.5-flash`).
  - **Call 1 (extract):** multimodal input -> JSON line items via `responseSchema`.
  - **Call 2 (analyze):** line items -> issues, savings estimate, confidence.
  - **Call 3 (letter):** analysis + user details -> letter text.
- **Validation:** Zod schemas on every Gemini response; one retry on malformed JSON.
- **Hosting:** Google Cloud Run (Dockerfile). Secrets via env var `GEMINI_API_KEY`.
- **Privacy:** nothing persisted; no logging of document contents.

## 4. Data shapes (core)

```ts
LineItem  { code?: string; description: string; amount: number; date?: string; provider?: string }
Issue     { id; title; severity: "high"|"medium"|"low"; lineItemRefs: number[];
            explanation: string; estimatedSavings: number; confidence: number; suggestedAction: string }
Analysis  { totalBilled: number; estimatedSavings: number; issues: Issue[]; documentType: "bill"|"eob"|"denial"|"unknown"; summary: string }
```

## 5. Repo & workflow

- `main` is always deployable. All work lands via **PRs from feature branches**, small and frequent.
- Branch names: `feat/...`, `fix/...`, `docs/...`, `chore/...`.
- **Every commit** ends with the co-author trailers (user + Claude session).
- Conventional-ish commit messages: `feat: ...`, `fix: ...`.
- Push after each logical step; merge PR when the build passes.

### PR roadmap

| # | Branch | Contents |
|---|---|---|
| 0 | `main` | PLAN.md, README, .gitignore |
| 1 | `feat/scaffold` | Next.js app, TS config, lint, Dockerfile, env example |
| 2 | `feat/gemini-core` | Gemini client, schemas, extract + analyze pipeline, `/api/analyze` |
| 3 | `feat/upload-ui` | Upload UI, sample bills, loading states, results view |
| 4 | `feat/letter` | `/api/letter`, letter editor, copy/download |
| 5 | `feat/share-card` | Savings card + share button |
| 6 | `chore/deploy` | Cloud Run deploy script and docs |
| 7 | `docs/submission` | One-pagers, video script, submission checklist |

## 6. Timeline (to 10:30 AM PT)

| Block | Goal |
|---|---|
| T-0:00 – 0:30 | Repo, scaffold, Gemini key, hello-world call |
| 0:30 – 1:30 | Extract + analyze pipeline working on 3 sample bills |
| 1:30 – 2:30 | Upload UI + results view |
| 2:30 – 3:00 | Letter generation |
| 3:00 – 3:30 | Deploy to Cloud Run, test public URL |
| 3:30 – 4:30 | Share card, polish, error states |
| Last 60 min | Record the two videos, write one-pagers, **submit early**; post video publicly to start engagement tracking |

## 7. Submission checklist

- [ ] Track chosen: Google AI Studio
- [ ] One-pager: team and pedigree
- [ ] One-pager: idea and prototype, with Google tools used (Gemini API, Cloud Run, AI Studio)
- [ ] Hosted prototype: public Cloud Run URL
- [ ] 2-minute video: team intro + pitch
- [ ] 1-minute video: prototype demo (Playcast), posted publicly
- [ ] Code repository: public GitHub link
- [ ] Opt-out of ad usage decided before submission (see event consent note)

## 8. Demo script (1 minute)

1. Hook (5s): "The average hospital bill has errors. Watch."
2. Upload a messy bill photo (10s).
3. Results appear: "$1,240 in likely overcharges" with 3 flagged issues (20s).
4. Tap an issue to show the explanation and cited reasoning (10s).
5. Generate the appeal letter (10s).
6. Close: success-fee model, "we only win when you win" (5s).

## 9. Pitch outline (5 min)

Problem -> Why now (multimodal LLMs read messy documents) -> Demo -> Business model (success fee, employer benefits channel) -> Market size -> Traction (video engagement, waitlist) -> Ask.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Gemini misreads a bad scan | Show extracted line items for user correction; confidence scores |
| Hallucinated rules or codes | Prompt to flag uncertainty; label results "potential" issues; disclaimer |
| Latency feels slow | Stream progress states in UI; use a fast model |
| Cloud Run deploy surprises | Deploy a hello-world early (T+3:00 at the latest) |
| Sensitive data | No persistence; sample bills are synthetic |
