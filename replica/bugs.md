# Bug Report: Claude Replica

Generated during `/replica-test` suite execution on 2026-11-20.

### Summary
- Open S1 (Critical / Blocker): 0
- Open S2 (Major Broken): 0
- Open S3 (Minor with workaround): 0
- Open S4 (Cosmetic / Polish): 1

---

### BUG-001: Mobile viewport sidebar toggle
- **Severity:** S4 (Cosmetic / Polish)
- **Flow / case:** UI-M1 (Mobile responsiveness on screens < 640px)
- **Screen:** App Shell / Sidebar
- **Steps:**
  1. Open app at 390px mobile viewport width.
  2. Observe left sidebar occupying horizontal width.
- **Expected:** Sidebar collapses into a hamburger icon drawer on mobile screens.
- **Actual:** Sidebar is fixed width on desktop; requires mobile overlay backdrop.
- **Status:** Open (queued for polish milestone).
