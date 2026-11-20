# Market Research & Fix Plan: Claude Replica

Source: Public discussions and reviews across Reddit (r/ClaudeAI, r/LocalLLaMA), Hacker News, Trustpilot, and App Store.

---

## 1. What They Hate (Ranked Complaints)

### 1. Artificial Rate Limits on Paid Subscriptions
- **The Issue:** Paying \$20/month for Claude Pro but getting blocked mid-workflow ("You have reached your limit until 3 PM") after only 10–15 messages in heavy coding sessions.
- **Evidence:**
  > *"The rate limits on Claude Pro are unbearable. I pay $20 a month and get cut off after 10 messages during deep coding sessions. I wish they had a pay-as-you-go or bring your own API key option so I never get interrupted."* — [Reddit r/ClaudeAI](https://reddit.com/r/ClaudeAI/comments/1e5m8s1/the_rate_limits_on_pro_are_unbearable/)

### 2. Single Provider Lock-in & Downtime
- **The Issue:** When Anthropic's API experiences downtime, users are completely blocked with zero option to fall back to a faster or alternative model.
- **Evidence:**
  > *"Claude is down again right in the middle of a work sprint. There is no automatic failover to another model provider. If Anthropic API has an outage you are completely blocked."* — [Reddit r/ClaudeAI](https://reddit.com/r/ClaudeAI/comments/1f1a4b9/claude_down_again_need_failover/)

### 3. Data Lock-in & Sudden Account Bans
- **The Issue:** All conversation history, custom instructions, and code snippets reside solely in Anthropic's cloud. If an account is flagged or banned, users lose years of work.
- **Evidence:**
  > *"Customer support is nonexistent. My account got banned for no reason and I lost all my past conversation history and prompt templates. We need local backups or data export."* — [Trustpilot](https://www.trustpilot.com/reviews/6698a123f8b1c40012345678)

---

## 2. What Is Missing (Top Requested Features)

### 1. Full-Text Chat History Search
- **The Issue:** No search bar in Claude's sidebar; users with hundreds of chats must scroll indefinitely to locate past solutions.
- **Evidence:**
  > *"Why is there still no search bar in Claude chat history? I have hundreds of chats and finding a snippet from two weeks ago is impossible. Please add full-text search across past chats."* — [Reddit r/ClaudeAI](https://reddit.com/r/ClaudeAI/comments/1dmb61x/why_is_there_still_no_search_bar_in_claude/)

### 2. Multi-File Project & ZIP Export
- **The Issue:** Artifacts only export individual raw snippets; no automated export to download an entire working project with `package.json` as a ZIP file.
- **Evidence:**
  > *"Artifacts are amazing for React prototyping, but there is no way to export multi-file projects as a ZIP. You have to manually copy each code block."* — [Hacker News](https://news.ycombinator.com/item?id=40748123)

### 3. Transparent Message Branch Navigation
- **The Issue:** Editing a prior prompt often overwrites downstream messages instead of maintaining an explicit version tree (`< 1 of 3 >`).
- **Evidence:**
  > *"Editing an earlier message destroys the alternative branch. In other tools you can navigate between versions like < 1 of 3 >. In Claude it feels clunky."* — [Reddit r/ClaudeAI](https://reddit.com/r/ClaudeAI/comments/1e4m5k1/editing_a_message_destroys_the_alternative/)

---

## 3. What Is Unsolved (The Market Gap)

Power developers and coding professionals who want:
1. **The Claude Artifacts UX** (clean typography, split-screen live React preview, warm aesthetic)
2. **Zero subscription caps & pay-per-token freedom** (using their own Anthropic / Gemini API keys)
3. **Local-first data privacy** (chat data stored on their own disk or Postgres database)

---

## 4. The Fix Plan (What Makes Our App Superior)

| # | Fix / Differentiating Feature | Size | Skill | Why It Wins |
| --- | --- | --- | --- | --- |
| 1 | **BYOK (Bring Your Own Key) & Zero Rate Limits** | S | `replica-backend` | Never get cut off; pay only pennies for actual API usage. |
| 2 | **Multi-Model Provider Switching (Claude + Gemini)** | S | `replica-build` | Instant failover; use Gemini 2.5 Flash for speed, Claude 3.7 for deep reasoning. |
| 3 | **Local-First Persistent Storage** | M | `replica-backend` | Full privacy and zero risk of lost conversations. |
| 4 | **Client-Side Full-Text Chat Search** | S | `replica-build` | Search all historical chats instantly with zero latency. |
| 5 | **One-Click Project / Artifact Export** | S | `replica-build` | Download standalone TSX, HTML, or full zip archives. |

---

## 5. Positioning Angle

### Option A (Recommended — The Developer Angle):
> **"For developers and researchers who love Claude's Artifacts but hate artificial rate-limits and cloud lock-in, our app provides the exact same editorial split-screen experience with Bring-Your-Own-Key pricing, local-first storage, and instant failover to Gemini Flash."**

### Option B (The Privacy & Local-First Angle):
> **"The private, self-hosted Claude alternative. Run your chats and interactive artifacts directly from your machine with zero data mining and zero monthly fees."**

---

## Next Step
Name the product, create original brand tokens and voice guide:
`/replica-brand`
