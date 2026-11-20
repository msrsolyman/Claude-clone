# Launch Plan: Atelier

---

## 1. Pre-Launch Beta & Foundation
- **Target Launch Window:** Day 1–7
- **Telemetry & Error Tracking:** Zero telemetry by default in Community edition; self-hosted Sentry / OpenTelemetry logging for cloud tiers.
- **GitHub Repository:** Open-source release of the web workbench under MIT/Apache 2.0 license.

---

## 2. Community Outreach & Channel Strategy

Lead with the solution to the user pain points identified in `replica/fixes.md`:

### Channel 1: Hacker News (Show HN)
- **Title:** `Show HN: Atelier – Local-first AI workbench with interactive React artifacts and BYOK`
- **Hook:**
  > "We love the split-screen live artifact preview workflow, but like many of you on HN, we got tired of paying \$20/month only to be rate-limited mid-coding session, with zero failover when the provider goes down.
  >
  > We built Atelier: an open, local-first workbench that executes React, Tailwind, and HTML in an isolated in-browser sandbox. Plug in your own API keys (Anthropic, Gemini, OpenAI), keep all conversation history locally on your disk, and never get blocked again."
- **Direct link to live demo:** Hosted Vercel / Docker preview.

### Channel 2: Reddit Communities
- **Subreddits:** `r/LocalLLaMA`, `r/webdev`, `r/reactjs`
- **Angle:** Zero cloud lock-in, in-browser Babel/React compilation, and privacy-first local storage.
- **Discussion Prompt:** *"How do you prototype UI with AI? We built an open split-screen artifacts runner that runs completely on your machine."*

### Channel 3: Product Hunt Launch
- **Tagline:** The local-first AI workbench with interactive artifacts.
- **Makers Comment:** Detail the journey of moving from proprietary subscription walls to developer autonomy and multi-model flexibility.

---

## 3. First 10 User Outreach (High-Touch Feedback)

Engage with 10 real builders who expressed frustration on public forums:
1. **Developer 1 (React Frontend Engineer):** Test live state persistence and component export.
2. **Developer 2 (Full-stack indie hacker):** Test Gemini Flash vs Sonnet cost savings.
3. **Developer 3 (Privacy-conscious researcher):** Test local database persistence without internet telemetry.
4. **Developers 4–10:** Gather feedback on multi-file artifact packaging and keyboard navigation.

---

## 4. Launch Day Checklist
- [x] Landing page copy finalized: `replica/launch/landing.md`
- [x] Pricing strategy documented: `replica/launch/pricing.md`
- [x] App Store & Play Store metadata validated with zero warnings: `replica/launch/listing.json`
- [x] Rebrand sweep clean with zero original trade dress: `replica/brand.json`
- [x] End-to-end test suite passing: `tests/e2e.test.mjs`
- [ ] Deploy live production instance: `/replica-deploy`
