# Hackathon Submission Kit

**Track:** Google AI Studio
**Live demo:** https://billback-bs6g.onrender.com
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

**Anjali Sharma-Tiwari, solo founder.** Student at Stanford University. Product, engineering, design and pitch.

- **Background:** B.S. in EECS + Math at Stanford. Focus on deep learning, sensor processing, computer vision and GenAI pipelines. [LinkedIn](https://www.linkedin.com/in/anjalist)
- **Relevant experience:** Research Fellow, Texas Tech ECE Lab: deep learning on FMCW radar spectrograms for real-time classification, published in IEEE WiSNet 2026. Software Engineer at DynaRyde: built an on-demand microtransit routing engine (Python, DBSCAN, SUMO) that cut passenger wait times by up to 35%.
- **Prior projects:** Autonomous tracking and localization stack on an NVIDIA Jetson Nano (VEX Robotics); real-time OpenCV vision pipeline for an autonomous RACECAR (MIT Beaver Works Summer Institute).
- **Why this background fits:** BillBack is the same skill set pointed at a new signal: turning messy, noisy real-world input (radar returns, camera frames, now crumpled bill photos) into structured data a model can reason about, then into a decision a person can act on.

**Why I am building this.** A medical bill is the only bill most people pay without understanding a single line of it. It arrives weeks after the care, lists codes nobody outside the industry can read, and a total that is often wrong: duplicate charges, upcoded visits, unbundled supplies, denials that would be overturned on appeal. Hospitals and insurers have billing departments and software on their side. The patient has a phone and a deadline. Most people pay, because checking feels impossible and disputing feels confrontational.

*An illustrative example (a composite, not a real patient):* a student goes to the ER for chest pain, gets a $3,867 bill, and pays it in installments. Nobody notices that the chest X-ray was billed twice and that the printed total is $300 more than the line items add up to. That is $620 gone, and finding it takes a trained eye and an afternoon most people do not have. BillBack finds it in about 60 seconds and writes the letter.

**Why me, why now.** Multimodal models like Gemini can finally read a crumpled photo of a bill as well as a billing specialist, return structured data, and draft a clear, polite dispute. As a solo builder I shipped the full product in a day: upload, extraction, analysis, deterministic math checks, appeal letters and a live deployment. I want to turn it into the patient's side of the billing department, paid only when it saves people money.

## 2-minute video (team intro and pitch)

1. (0:00-0:20) "I'm Anjali, a Stanford student and BillBack's solo founder. I built BillBack because the people who receive medical bills have the least help reading them."
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
- [x] Team one-pager filled in
- [x] Idea one-pager (above) reviewed; hosting line filled in
- [ ] Public prototype URL tested from a phone: https://billback-bs6g.onrender.com (tested on desktop with 3 fictional samples; open it a minute before demoing, the free tier sleeps when idle)
- [ ] Public GitHub repo link: https://github.com/anjalist08/bill-back
- [ ] 2-minute video uploaded
- [ ] 1-minute demo video public on YouTube
- [ ] Ad-usage opt-out decided (see the event's data consent note) before submitting
- [ ] Submitted before 10:30 AM PT
