# Hackathon Submission Kit

**Track:** Google AI Studio
**Live demo:** https://billback-za9r.onrender.com
**Deadline:** 10:30 AM PT, Nov 14 (hard stop)

## One-pager: the idea

**BillBack** turns a confusing medical bill or insurance denial into a clear list of potential errors and a ready-to-send dispute letter in about a minute.

**Problem.** Medical bills are opaque and frequently contain mistakes: duplicate charges, over-coded visits, unbundled supplies, appealable denials. Most people never check, because the bill is unreadable and disputing it is intimidating.

**Solution.** Upload a photo or PDF. Gemini reads the document (multimodal), extracts every line item, flags potential issues with plain-English explanations, confidence scores and estimated savings, then drafts a polite, specific dispute letter. A shareable savings card helps the result spread.

**Built with Google tools.** Gemini API (multimodal document understanding, structured JSON output, text generation) via the `@google/genai` SDK, Google AI Studio for the API key and prompt iteration, and Render (free tier) for hosting.

**Business model.** Free analysis; success fee (a percentage of savings recovered) or per-letter fee. Channels: employer benefits platforms, patient advocates, insurers' member apps.

**Why it is fundable.** Large, painful and recurring problem; clear value metric ("$ found"); natural viral loop (savings card); defensible data over time on provider- and code-level error patterns.

**Honest limits.** Results are potential issues to verify, not legal or medical advice. Nothing is stored; documents are processed in memory.

## One-pager: the team

[Fill in: names, roles, school, relevant experience, prior projects or startups, and why this team.]

## 2-minute video (team intro and pitch)

1. (0:00-0:20) Who we are, in one line each. [fill in]
2. (0:20-0:50) The problem: a real story of a confusing bill. Hook: "Most hospital bills have mistakes. Nobody checks."
3. (0:50-1:25) The solution and a 20-second clip of the product.
4. (1:25-1:50) Business model and market: success fee, employer channel.
5. (1:50-2:00) Ask: pitch access to VCs, and one-line vision.

## 1-minute demo video (Playcast)

1. (0:00-0:05) "Watch me find $1,760 in billing errors in under a minute."
2. (0:05-0:15) Drop the sample bill in (use the fictional sample or a synthetic bill; never a real one).
3. (0:15-0:35) Show the savings number, then tap through two issues and their explanations.
4. (0:35-0:50) Click "Draft my letter"; scroll the letter.
5. (0:50-1:00) Download the savings card. "BillBack. We win when you win."

Post the demo publicly on YouTube **as early as possible**; engagement counts toward the score.

## Final checklist

- [ ] Track selected: Google AI Studio
- [ ] Team one-pager filled in
- [x] Idea one-pager (above) reviewed; hosting line filled in
- [ ] Public prototype URL tested from a phone: https://billback-za9r.onrender.com (tested on desktop with 3 fictional samples; open it a minute before demoing, the free tier sleeps when idle)
- [ ] Public GitHub repo link: https://github.com/anjalist08/bill-back
- [ ] 2-minute video uploaded
- [ ] 1-minute demo video public on YouTube
- [ ] Ad-usage opt-out decided (see the event's data consent note) before submitting
- [ ] Submitted before 10:30 AM PT
