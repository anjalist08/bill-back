# BillBack

**Live demo:** https://billback-7nn9.onrender.com

Upload a medical bill or insurance denial. Gemini finds likely errors, estimates your savings, and drafts the dispute letter.

Built for the Berkeley x Google DeepMind hackathon (Google AI Studio track).

## Run it

```bash
cp .env.example .env.local   # add a free key from https://aistudio.google.com/apikey
npm install
npm run dev
```

No key? Click **Try a sample bill** to use the built-in fictional sample. See [docs/DEPLOY.md](./docs/DEPLOY.md) to deploy.

See [PLAN.md](./PLAN.md) for the full build plan.

> BillBack provides information, not legal or medical advice. Results are potential issues to verify.
