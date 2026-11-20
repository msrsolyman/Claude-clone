# Build Log: Claude Replica

| Screen ID | Screen Name | Date | Status | Missing / Notes |
| --- | --- | --- | --- | --- |
| App Shell | Sidebar & Navigation | 2026-11-20 | Done | Includes warm light/dark theme toggle, new chat CTA, recent list |
| S02 | Home / New Chat | 2026-11-20 | Done | Hero greeting, PromptBox, Model selector, prompt starter cards |
| S03 | Chat Thread | 2026-11-20 | Done | Real-time token streaming, ThinkingAccordion, inline Artifact cards, copy actions |
| S04 | Artifacts Split-View | 2026-11-20 | Done | Split-screen drawer, sandboxed iframe runner with live React/Tailwind/HTML execution, code editor view, copy & download |
| S01 | Auth / Sign-in | 2026-11-20 | Partial | UI mock profile active; OAuth/Magic Link integration in replica-backend |
| S05 | Projects Dashboard | 2026-11-20 | Partial | Sidebar project navigation active; full dashboard screen in next milestone |
| S06 | Project Detail & Chat | 2026-11-20 | Partial | Document upload handler in backend milestone |
| S07 | User Settings | 2026-11-20 | Partial | Theme toggle active; BYOK key input modal in backend milestone |

## Hard parts encountered:
1. **Sandboxed React Execution:** Required in-browser runtime compilation using Babel Standalone + React UMD + Tailwind CDN inside an isolated `sandbox="allow-scripts"` iframe to prevent any parent window security breach.
2. **Streaming Artifact Parser:** Built a robust regex & tag parser (`artifact-parser.ts`) that extracts `<thinking>` and `<antArtifact>` tags on the fly without breaking during partial token reception.
