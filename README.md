
# 🛡️ OpportunityShield

**An Intelligent Platform to Detect Fake Internships, Scholarships, and Hackathons**
*Spot fake opportunities. Stay safe.*

Paste an opportunity link or its announcement text and get an **explainable** Low / Medium / High risk score (0-100) with the exact evidence behind it,
a per-category breakdown, recommended actions, a searchable history and community reporting.

> **The score is guidance, not proof.** A high score does not prove fraud and a low score does not prove an opportunity is genuine. Always verify through official channels.

Team **Tech Bees** · Hacktoberfest × VectorFlow 2026 · Track 2, Challenge B

## What is implemented

| Area | Details |
|---|---|
| URL analysis | Shorteners, raw/private IPs, punycode look-alikes, brand impersonation, opportunity-keyword + hyphen/year domains, subdomain tricks, risky TLDs, plain HTTP, embedded credentials. **Links are never fetched or opened.** |
| Text analysis | Advance fees, informal payment channels, OTP/password/PIN, bank and ID requests, guaranteed selection, unrealistic stipends, urgency, WhatsApp/Telegram-only contact, free-mail contacts, unverifiable claims. Matched text is shown as evidence; negations ("no registration fee") are respected. |
| Scoring | Deterministic weighted rules, per-group caps (30/25/20/15/10), thresholds Low 0-29 / Medium 30-59 / High 60-100. See [`docs/SCORING_METHODOLOGY.md`](docs/SCORING_METHODOLOGY.md). |
| Dashboard | Layout based on the supplied design: sidebar, Check URL / Check Text tabs, risk meter, *Why is it flagged?*, Opportunity Details, Risk Breakdown, Recommended Actions, Recent Checks, Safety Tips. |
| History / Reports / Profile | Search + filter + detail view; report form with duplicate and rate-limit handling and "unverified allegation" labelling; profile with storage status and confirmed reset. |
| Storage | Local JSON file by default (works offline, no accounts). Optional Supabase/PostgreSQL with migration + RLS. |
| Optional | Google Safe Browsing lookup, only if `SAFE_BROWSING_API_KEY` is set. Otherwise the UI states that no external check was performed. |

**Not implemented (roadmap):** user accounts/login, machine-learning models, web crawling, image/visual analysis, browser extension, WHOIS/domain-age checks, moderator workflow.
This prototype is a transparent **rule-based** engine, not ML. See [`docs/PRESENTATION.md`](docs/PRESENTATION.md) for the implemented-vs-planned table.

## Verification status

| Check | Result |
|---|---|
| `npm run lint` | ✅ passes (run in the build environment) |
| `npm run typecheck` | ✅ passes |
| `npm test` (Vitest, 95 tests) | ✅ passes |
| `npm run build` (Next.js production build) | ✅ passes |
| HTTP smoke test of the production server (all pages 200; analyze, history, reports, duplicates, rate limit, CSRF/content-type rejection, reset) | ✅ done with `curl` |
| Playwright end-to-end tests (`e2e/`) | ⚠️ **written but NOT run**: no browser could be installed in the build environment. Run `npm run test:e2e` yourself. |
| Visual match of the UI to the design screenshot | ⚠️ **not visually inspected** (no browser available). CSS compiles and all expected classes are present; please check it in your browser. |
| Supabase persistence against a live project | ⚠️ **not tested** (needs your credentials) |
| Google Safe Browsing | ⚠️ **tested with mocked responses only** |
| Deployment to Vercel / push to GitHub | ❌ **not done**: requires your accounts. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). |

## Run it on Windows (PowerShell)

1. Install Node.js 22 LTS (>= 20.9 works): `winget install OpenJS.NodeJS.LTS`, then **close and reopen PowerShell**. Check: `node -v`.
2. Extract `opportunityshield-hackathon.zip` and open the folder in VS Code:

```powershell
Expand-Archive .\opportunityshield-hackathon.zip -DestinationPath .
cd .\opportunityshield
code .
```

3. In the VS Code terminal (Ctrl+`):

```powershell
npm ci                         # installs the exact versions from package-lock.json
Copy-Item .env.example .env.local   # optional: the app runs without any keys
npm run dev
```

4. Open http://localhost:3000. Click a demo scenario (e.g. *Internship asking for a fee*): you should see **High Risk 78/100**.

Production mode (recommended for the live demo, faster): `npm run build; npm start`.

### Quality checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium   # once
npm run test:e2e                  # builds, starts on port 3100 with isolated data
npm run check                     # lint + typecheck + unit tests + build
```

### Optional: Supabase and Safe Browsing

Put values in `.env.local` (never commit it). See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for running the SQL migration in `supabase/migrations/`.
After connecting, verify: Profile shows "Supabase (cloud database)", run a scan, and see the row in the `analyses` table.

### Troubleshooting

| Problem | Fix |
|---|---|
| `npm` / `node` not recognised | Reopen PowerShell after installing Node. |
| Port 3000 busy | `npm run dev -- -p 3001` |
| `EACCES`/`EPERM` on install | Move the folder out of OneDrive/Downloads, e.g. `C:\dev\opportunityshield`, then `Remove-Item node_modules -Recurse -Force; npm ci`. |
| Scripts disabled in PowerShell | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Stale build/odd errors | `Remove-Item .next -Recurse -Force; npm run dev` |
| "Could not save" / storage errors | Make sure the folder is writable (local mode writes `.data/`), or check Supabase URL/key and that the migration ran. |
| History empty after restart on Vercel | Without Supabase, Vercel's disk is temporary. Use Supabase or run locally. |

## Project structure

```
app/            Next.js pages (/, /check, /history, /reported-scams, /profile, /methodology) and API routes
components/     Dashboard UI components
lib/            analysis engine (rules, scoring, analyzer), validation, storage, security helpers, demo data
supabase/       SQL migration + optional seed
tests/          Vitest unit/integration tests      e2e/   Playwright tests
docs/           Architecture, API, scoring methodology, demo script, deployment, presentation notes
```

## Security notes

Strict server-side validation, no URL fetching (no SSRF surface), CSRF/origin and content-type checks, rate limiting, CSP and security headers, PII redaction in reports,
RLS-enabled tables with service-role-only access, no secrets in the repo (`.env*` ignored). **There is no real authentication yet**: demo-mode history is tied to an
anonymous httpOnly cookie. Details in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Demo data

All demo organisations are fictional and use reserved domains (`.example`), so they can never accuse a real organisation. Demo entries are labelled **Demo data** and are scored by the same engine as normal submissions.

## AI-assistance disclosure

This codebase was generated with the help of an AI assistant (Claude) in a single session. If you are entering the *GitHub Copilot* challenge, only state Copilot usage that actually happened
in your workflow, and be ready to explain any part of the code.

## License

MIT, see [LICENSE](LICENSE).
##Dashboard
<img width="1892" height="1008" alt="Screenshot 2026-10-27 153103" src="https://github.com/user-attachments/assets/d4f838cf-109a-4272-9cb3-3842058f1a2c" />
<img width="1903" height="1002" alt="Screenshot 2026-10-27 153035" src="https://github.com/user-attachments/assets/b87be81d-e72e-4c49-8bfb-f8abd2b8c900" />
<img width="1825" height="882" alt="Screenshot 2026-10-27 150051" src="https://github.com/user-attachments/assets/08301e64-edf3-4e75-96bf-b439dceeb51d" />

