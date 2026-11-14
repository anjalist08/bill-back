# Submission form answers (copy and paste)

Answers for the "November 14th UC Berkeley x Deepmind Hackathon" Google Form. Each answer is in a plain-text block, so copy only the text inside the block. Fields marked **YOU** need something only you can provide.

## Email
**YOU:** tick the checkbox to record your account's email.

## Team Name
```
BillBack
```

## Team Leader Name
```
Anjali Sharma-Tiwari
```

## Team Leader Email (same as Luma)
**YOU:** use the exact email you registered with on Luma.

## Team Leader Linkedin
```
https://www.linkedin.com/in/anjalist
```

## Team Members (Names, Emails, LI profiles - up to 3, excluding leader)
```
None (solo team)
```

## One-Pager for a team (Plain text. Not a link)
```
TEAM: BillBack (solo founder)

Anjali Sharma-Tiwari, founder. EECS + Math student at Stanford University. Built all of BillBack: product, engineering, design and pitch.

Background
- Research Fellow, Texas Tech University ECE Lab: deep learning models on FMCW radar spectrograms for real-time classification. Published in IEEE WiSNet 2026.
- Software Engineer, DynaRyde: built an on-demand microtransit routing engine (Python, DBSCAN spatial clustering, SUMO traffic simulation) that cut passenger wait times by up to 35%.
- Robotics Engineer, VEX Robotics: fully autonomous tracking and localization stack on an NVIDIA Jetson Nano (sensor fusion, control loops, path planning).
- MIT Beaver Works Summer Institute, Autonomous RACECAR: real-time OpenCV computer vision pipeline with closed-loop steering control.

Why this team fits the problem
My work has always been turning messy, noisy real-world input (radar returns, camera frames) into structured data a model can reason about, then into a decision a person can act on. A crumpled photo of a medical bill is the same kind of problem with much higher stakes for ordinary people.

Why I am building this
A medical bill is the only bill most people pay without understanding a single line. It arrives weeks after the care, lists codes nobody outside the industry can read, and its total is often wrong: duplicate charges, upcoded visits, unbundled supplies, denials that would be overturned on appeal. Hospitals and insurers have billing departments and software. The patient has a phone and a deadline. Multimodal models like Gemini can now read that bill like a billing specialist. As a solo builder I shipped the whole product in a day: upload, extraction, analysis, deterministic math checks, appeal letters and a live deployment.
```

## One-Pager for the idea (Project Description. Plain text. Not a link)
```
BillBack: find the errors in your medical bill in about 60 seconds.

PROBLEM
Medical bills and insurance denials are opaque and frequently wrong: duplicate charges, upcoded visits, unbundled supplies, math errors, and denials that would be overturned on appeal. Most people never check, because the bill is unreadable and disputing it feels intimidating.

SOLUTION
Upload a photo or PDF of a bill, EOB or denial letter. Gemini reads the document (multimodal) and extracts every line item as structured JSON. BillBack then flags potential issues, each with a plain-English explanation, the line items involved, an estimated dollar amount, a confidence score and what to ask for. Arithmetic (printed total vs. line items) is checked deterministically in code, and amounts are capped to the referenced line items, so the headline number is never invented. One click drafts a polite, specific dispute letter, or an appeal to the insurer for denials. A shareable savings card shows only the numbers, never the document.

EXAMPLE (fictional ER bill)
$3,867 billed. BillBack found the same chest X-ray billed twice ($320) and a printed total $300 higher than the line items: $620 in potential errors, plus a ready-to-send letter.

BUILT WITH GOOGLE
Gemini API via Google AI Studio and the @google/genai SDK: multimodal document understanding, structured JSON output with schema validation and retry, and text generation for letters. Uses the latest Gemini Flash models, with automatic retry and model fallback. Next.js app, hosted on Render (free tier).

BUSINESS MODEL
Free analysis. Success fee (a percentage of money recovered) or a per-letter fee, so BillBack wins only when patients win. Channels: employer benefits platforms, patient advocates, insurers' member apps.

WHY IT IS FUNDABLE
Large, painful, recurring problem; a clear value metric ("$ found"); a natural viral loop (the savings card); and defensible data over time on provider- and code-level error patterns.

HONEST LIMITS
Results are potential issues to verify, not legal or medical advice. Nothing is stored: documents are processed in memory.
```

## Hosted Prototype URL
```
https://billback-bs6g.onrender.com
```
Open it about a minute before judging. The free tier sleeps when idle and takes about 50 seconds to wake.

## YouTube Video URL: 2-Minute Video (team intro and pitch)
```
https://youtu.be/c704E9NkUzs
```

## YouTube Video URL: 1-Minute Video (prototype walkthrough)
```
https://youtu.be/NHoT_VOtxrQ
```

## Code Repository Link
```
https://github.com/anjalist08/bill-back
```
The form asks for an AI Studio share link on the AI Studio track, or a public GitHub repo for Antigravity CLI projects. BillBack is a public GitHub repo that uses the Gemini API through an AI Studio key. Check with the organizers which they prefer.

## Is it AI studio or AGY CLI track?
AI studio

## Are you planning to attend in-person?
**YOU:** Yes or No.
