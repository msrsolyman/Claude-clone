# Brand Identity: Atelier

The local-first AI workbench with interactive artifacts and multi-model freedom.

---

## 1. Name Selection

From the positioning in `replica/fixes.md`, 20 candidates were generated across styles:
- **Descriptive:** ArtifactDesk, PromptCraft, CodeScribe, LiveCanvas
- **Compound:** CanvasMind, DevPulse, ForgeMind, Slotwise
- **Invented:** Velox, Synapse, Aethel, Novastack
- **Metaphor:** **Atelier**, Prism, Foundry, Beacon
- **Verb:** Craft, Render, Forge, Dispatch

### Top 5 Shortlist:
1. **Atelier** (Selected) — French for an artist or craftsman's private workshop. Suggests deep craft, tactile tools, and high-performance prototyping.
2. **CanvasMind** — Communicates live canvas + AI thinking.
3. **ArtifactForge** — Direct, developer-centric.
4. **PrismDesk** — Multi-model light refracts through a prism.
5. **Velox** — Emphasizes speed and zero rate limits.

---

## 2. Screening Checks (Atelier)

| Check | Target / Registry | Status | Notes |
| --- | --- | --- | --- |
| **US Trademark** | USPTO TESS (Class 9 / 42) | To verify | Multiple generic uses in arts; distinctive when paired with 'Workbench' or 'AI' |
| **EU Trademark** | EUIPO / TMview | To verify | Standard screening recommended |
| **Domain** | Whois / Registrar | Available variants | `atelier-ai.com`, `useatelier.dev`, `atelierworkbench.com` |
| **App Store & Play** | App Store Search | Clear | No conflicting flagship AI code runner under this exact title |
| **Handles** | GitHub / X | Available | `@atelier-ai`, `@atelier_workbench` |
| **Web Search** | Google "Atelier AI workbench" | Clear | No dominant competing SaaS product |

---

## 3. Brand Palette (Nordic Teal & Slate)

Differentiated completely from the original's terracotta/coral trade dress.

### Color Tokens:
- **Primary Accent:** `#0f766e` (Deep Pine/Teal) — High-contrast (5.47:1 AA with white).
- **Dark Accent:** `#14b8a6` (Luminous Teal) — High-contrast (5.81:1 AA with `#042f2e`).
- **Surfaces (Light):** `#fafaf9` (Warm Stone) & `#f5f5f4` (Muted Slate).
- **Surfaces (Dark):** `#121214` (Deep Charcoal) & `#1a1a1e` (Studio Canvas).
- **Contrast Check:** 8 pairs tested with `contrast.py`, 0 AA failures (100% compliant).

---

## 4. Logo & Icon Brief

- **Concept:** A clean, architectural monogram "A" fused with an interactive split bracket `[A]`, symbolizing code execution and craftsman elegance.
- **Mark Type:** Modern geometric symbol + minimalist lowercase/serif wordmark ("atelier").
- **Scalability:** Must remain razor-sharp at 16x16px (browser favicon) and render cleanly at 1024x1024px (macOS / iOS app icon).
- **Deliverables:**
  - `icon.svg` (scalable vector mark)
  - `favicon.ico` & `apple-touch-icon.png` (180x180)
  - App Store / PWA icon (1024x1024 without alpha transparency)
  - Open Graph social share image (1200x630px)

---

## 5. Brand Voice Guide

### Three Core Tone Attributes:
1. **Precise, not pedantic:** We explain technical realities with clarity and accuracy without condescending jargon.
2. **Grounded, not dull:** Confident, utilitarian, and calm. We let the developer's work take center stage.
3. **Empowering, not patronizing:** We don't hide code or treat users like beginners. We give them keys, source, and control.

### 5 Do's & Don'ts:
- **Do** talk about control, speed, and privacy. **Don't** use hype words like "revolutionary magic".
- **Do** emphasize "Your models, your keys, your machine". **Don't** refer to proprietary subscriptions.
- **Do** write clean, active verbs ("Build", "Inspect", "Run", "Export"). **Don't** write conversational filler.
- **Do** respect the user's attention with zero popups or telemetry nags.
- **Do** present errors constructively with actionable retry options.

### 10 Rewritten Core Strings:
1. **Hero Title:** *"Welcome to Atelier."* (Was: *"Good day"*)
2. **Hero Subtitle:** *"The local-first workbench for interactive code, artifacts, and multi-model intelligence."*
3. **Prompt Placeholder:** *"How can Atelier help you build or explore today?"*
4. **New Chat CTA:** *"New Session"*
5. **Projects Title:** *"Workspaces"*
6. **Recent Chats Header:** *"Recent Sessions"*
7. **Submit Tooltip:** *"Execute Prompt (Enter)"*
8. **Artifact Badge:** *"📦 Artifact Created: [Title]"*
9. **Code Drawer Header:** *"Preview & Source Inspector"*
10. **Error State:** *"Execution interrupted. Verify API credentials or retry session."*

---

## 6. Rebrand Sweep Verification

Command:
```bash
python sweep.py D:\Claude --config D:\Claude\replica\brand.json
```
**Result:**
`Clean. Nothing of the original's name, domain or colours found.`
Exit code: **0**.
