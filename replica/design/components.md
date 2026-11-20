# Component Specifications: Claude Replica

Derived from `replica/recon.md` and WCAG AA contrast verified tokens.

---

### Button
- **variants:** `primary` (accent background), `secondary` (surface with border), `ghost` (transparent, hover surface), `danger` (danger outline/bg)
- **sizes:** `sm` (32px, text-xs), `md` (40px, text-sm), `lg` (48px, text-base)
- **states:** `default`, `hover`, `active`, `focus-visible` (2px ring border-input), `disabled` (opacity-50, cursor-not-allowed), `loading` (spinner + text)
- **tokens:** `bg-accent text-on-accent rounded-md font-medium transition-colors`
- **a11y:** Native `<button>`, `aria-disabled` when loading, visible focus ring.
- **used on:** All screens (S01–S07).

---

### PromptBox (Core Input)
- **variants:** `hero` (large centered on S02), `footer` (sticky bottom on S03, S06)
- **sizes:** Auto-expanding height (min 56px, max 240px with scroll)
- **states:** `default` (border border-input), `focus-within` (ring-1 ring-border-input), `filled`, `disabled`
- **tokens:** `bg-surface text-text rounded-xl p-3 border shadow-card`
- **subcomponents:**
  - `Textarea`: multiline, auto-resize, `Shift+Enter` for newline, `Enter` to submit.
  - `AttachmentButton`: opens system file picker (Lucide `Paperclip` icon).
  - `ModelSelectorPill`: dropdown showing active model.
  - `SubmitButton`: circular button with Lucide `ArrowUp` icon, disabled when input is empty.
- **a11y:** `aria-label="Ask Claude anything"`, keyboard shortcut hints announced.
- **used on:** S02, S03, S06.

---

### ChatMessage
- **variants:** `user` (right-aligned or clean bubble), `assistant` (left-aligned full-width prose)
- **states:** `sending`, `streaming` (blinking caret), `completed`, `error`
- **tokens:** `text-text font-sans text-base leading-relaxed`
- **subcomponents:**
  - `ThinkingAccordion`: collapsible drawer for reasoning tokens with pulsing dot indicator.
  - `MarkdownRenderer`: formatted typography, code blocks with copy button.
  - `ActionBar`: appears on hover (`Copy`, `Edit`, `Retry`, `Branch nav < 1/2 >`).
- **a11y:** Semantic list `role="log"`, `aria-live="polite"` during streaming.
- **used on:** S03, S06.

---

### ThinkingAccordion
- **variants:** `active` (pulsing indicator during reasoning), `complete` (static chevron toggle)
- **states:** `collapsed` (default), `expanded`
- **tokens:** `bg-surface/50 border border-border text-text-muted text-sm rounded-lg p-2.5`
- **a11y:** `aria-expanded` toggle, accessible label "Show reasoning process".
- **used on:** S03.

---

### ArtifactCard (Inline trigger)
- **variants:** `code`, `react`, `html`, `svg`, `markdown`
- **states:** `default`, `active` (when open in right drawer), `hover`
- **tokens:** `bg-surface border border-border rounded-lg p-3 cursor-pointer hover:border-accent/40`
- **header:** Icon (Code/Layout), Artifact Title, identifier, and "Click to view" pill.
- **a11y:** Keyboard focusable, triggers split-screen opening on `Enter`.
- **used on:** S03.

---

### ArtifactDrawer (Split-Screen Runner)
- **variants:** `split` (50% chat / 50% artifact), `maximized` (full viewport), `closed`
- **tokens:** `bg-surface border-l border-border h-full shadow-pop flex flex-col`
- **header:**
  - Title and version selector (`v1`, `v2`, etc.).
  - Tab switcher: `Code` vs `Preview`.
  - Action buttons: `Copy Code`, `Download`, `Pop out`, `Close` (Lucide `X`).
- **body:**
  - `Code View`: syntax-highlighted editor with line numbers (`JetBrains Mono`).
  - `Preview View`: sandboxed iframe rendering live HTML/React/SVG.
- **a11y:** Resizable pane with keyboard handles, `Esc` to close drawer.
- **used on:** S04.

---

### SandboxedPreview (Live Runner)
- **variants:** `react`, `html`, `svg`
- **states:** `loading` (translucent skeleton), `rendered` (live interactive app), `runtime-error` (red error toast)
- **architecture:**
  - `iframe` with `sandbox="allow-scripts"` (zero parent cookie/token access).
  - PostMessage bridge sending compiled JSX and styles into the iframe.
  - Babel Standalone for runtime transpilation + Tailwind script tag for instant styling.
- **used on:** S04.

---

### SidebarNav
- **variants:** `expanded` (width 260px), `collapsed` (icons only or hidden on mobile)
- **tokens:** `bg-surface border-r border-border text-text-muted`
- **sections:**
  - `New Chat Button`: primary CTA with `Plus` icon.
  - `Projects Section`: list of user knowledge projects.
  - `Recents List`: conversations grouped by `Today`, `Yesterday`, `Previous 7 days`.
  - `User Profile Footer`: user avatar, name, and Settings trigger.
- **a11y:** Collapsible drawer with mobile overlay backdrop and `aria-hidden` when closed.
- **used on:** S02, S03, S05, S06.

---

### ModelSelector
- **variants:** `button-pill` (inside PromptBox), `dropdown-menu`
- **states:** `closed`, `open`
- **options:**
  - `Claude 3.7 Sonnet` (Most intelligent, hybrid reasoning).
  - `Claude 3.5 Haiku` (Fastest for quick tasks).
  - `Gemini 2.5 Flash` (High speed multimodal alternative).
- **tokens:** `bg-surface text-text border border-border rounded-pill text-xs px-2.5 py-1`
- **used on:** S02, S03.
