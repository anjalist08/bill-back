# Deploying BillBack

BillBack is a standard Next.js app (`output: standalone`). It needs one environment variable: `GEMINI_API_KEY`.

## Get a free Gemini key
1. Go to https://aistudio.google.com/apikey and create a key. Do **not** enable billing; the free tier is enough for the demo.
2. Never commit the key. `.env*` is gitignored.

## Run locally
```bash
cp .env.example .env.local   # then paste your key into GEMINI_API_KEY
npm install
npm run dev                  # http://localhost:3000
```
Without a key the app still works in sample mode ("Try a sample bill" and the template letter).

## Option A: Vercel (free Hobby plan, recommended for a free setup)
1. Import the GitHub repo at https://vercel.com/new.
2. Add the environment variable `GEMINI_API_KEY`.
3. Deploy. The URL is your public demo link.

## Option B: Google Cloud Run (hackathon-recommended)
Cloud Run has a free allowance but **requires a billing account on the project** before you can deploy.
```bash
gcloud run deploy billback \
  --source . \
  --region us-west1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```
The repo's `Dockerfile` listens on port 8080 as Cloud Run expects.

## Privacy
Documents are processed in memory and never stored or logged. Note that Google may use free-tier Gemini inputs to improve its products, so demo with the fictional sample or synthetic bills, not real patient data.
