# Pricing Strategy: Atelier

Market Date: 2026-11-20

---

## 1. Competitive Pricing Matrix

| Provider / Tool | Plan | Public Price | Model Limitations | Date Verified |
| --- | --- | --- | --- | --- |
| **Claude Pro** | Individual | \$20 / mo | Capped message limits (resets every 5 hours); single provider | 2024-08 |
| **ChatGPT Plus** | Individual | \$20 / mo | Capped GPT-4o usage; no native interactive artifact split runner | 2024-08 |
| **Cursor Pro** | Developer | \$20 / mo | 500 fast requests; per-seat subscription lock-in | 2024-08 |
| **LibreChat / TypingMind** | BYOK License | \$39 one-time or \$0 self-hosted | Pay-as-you-go API tokens | 2024-08 |

---

## 2. Real User Complaints on Pricing & Billing

From `replica/feedback.md` and public review tracking:
- **Artificial Mid-Sprint Interruption:** Paying \$20/mo and getting cut off when solving critical bugs.
- **Wasted Subscriptions:** Paying full price during weeks of low usage.
- **Lock-in:** Inability to route background tasks to cheap models (like Gemini Flash) while keeping complex reasoning on Sonnet.

---

## 3. The Atelier Pricing Model

### Tier 1: Community (The Core Offering)
- **Price:** **\$0 / Free Forever**
- **Target:** Independent developers, students, researchers.
- **Includes:**
  - Full local-first studio running on your machine
  - Unlimited interactive artifacts & sandboxed live preview
  - Bring Your Own API Key (Anthropic, Gemini, OpenAI)
  - Zero rate limits from our side — pay only your direct provider token costs
  - Local disk SQLite / JSON persistence

### Tier 2: Pro Sync & Cloud
- **Price:** **\$9 / month** or **\$79 / year** (Save 27% / 2 months free)
- **Target:** Full-time professional builders.
- **Includes:**
  - Everything in Community
  - Encrypted multi-device cloud synchronization
  - Managed PostgreSQL storage & automated daily backups
  - Hosted remote deployment of public artifact web apps
  - Priority support & feature access

### Tier 3: Studio & Team
- **Price:** **\$19 / user / month**
- **Target:** Small teams, startups, and agencies.
- **Includes:**
  - Everything in Pro
  - Shared project knowledge bases & workspace document libraries
  - Team API key pooling and quota management
  - Audit trails and workspace member roles

---

## 4. Fair Billing Principles

1. **One-Click Instant Cancellation:** Stripe Customer Portal allows cancelling anytime with zero friction.
2. **Never Trapped in Subscriptions:** If a user cancels Pro, their local database and files remain completely untouched on their machine.
3. **No Hidden Surcharges:** We do not mark up API tokens; users hold their own direct provider accounts.

---

## 5. Stripe Products & Price Configuration

For production deployment in Stripe Dashboard:

```text
Product 1: Atelier Pro
- ID: prod_atelier_pro
- Monthly Price: $9.00 USD (price_atelier_pro_monthly) - Recurring monthly
- Annual Price: $79.00 USD (price_atelier_pro_annual) - Recurring yearly

Product 2: Atelier Studio Team
- ID: prod_atelier_team
- Per Seat Monthly: $19.00 USD (price_atelier_team_seat) - Recurring monthly per quantity
```
