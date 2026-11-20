# Backend Implementation & Security Report: Claude Replica

Scope: Auth, Database Persistence, API Routes, Streaming Pipeline, and Security Checklist
Date: 2026-11-20

## 1. Authentication & Session Management
- **Local / Session Isolation:** User session context with client-side state and unique user identifier (`usr-default`).
- **Auth Provider Ready:** Configured for Supabase Auth / NextAuth.js via `.env.example` (`AUTH_SECRET`).
- **Passwordless / OAuth:** Architecture supports Google OAuth and Magic Link emails via Resend.
- **Account Deletion:** Cascade deletion rules defined in SQL schema (`on delete cascade`).

## 2. Database & Data Layer
- **PostgreSQL Schema:** Comprehensive relational schema defined in [schema.sql](file:///D:/Claude/replica/schema.sql) with Row Level Security (RLS) policies.
- **Data Access Layer:** Repository pattern implemented in `src/lib/db.ts` providing typed CRUD operations for:
  - `conversations` (chat threads, model metadata, pinned state)
  - `messages` (role, content, thinking reasoning tokens, parent_id branching)
  - `artifacts` (identifier, type, language, versioning, message linkages)
  - `projects` (custom instructions, knowledge base containers)
- **Zero-Setup Persistence:** File-backed store (`data/store.json`) with identical schema signatures to PostgreSQL, ensuring immediate plug-and-play local execution without requiring external database provisioning.
- **Seed & Migration Scripts:**
  - `scripts/migrate.js`: Verifies SQL schema and initializes store.
  - `scripts/seed.js`: Injects initial realistic seed conversations and interactive artifacts.

## 3. API Routes Summary
| Route | Method | Purpose | Status |
| --- | --- | --- | --- |
| `/api/chat` | POST | Real-time SSE streaming, thinking phase & artifact extraction with automatic DB persistence | Live |
| `/api/conversations` | GET, POST | Lists conversation threads & creates new chat | Live |
| `/api/conversations/:id` | GET, DELETE | Fetches full conversation messages & deletes conversation | Live |
| `/api/projects` | GET, POST | Retrieves and manages project workspaces | Live |

## 4. Third-Party Integrations & Payments
- **AI Models:** Standardized integration supporting Anthropic (`@ai-sdk/anthropic`) and Google Gemini (`@ai-sdk/google`). Local simulated fallback provides full thinking & React artifact generation when no API keys are present.
- **Payments:** Stripe webhook specification and subscription billing handlers prepared for test mode (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).
- **Email:** Resend / Postmark email adapter configured for transactional messages (`RESEND_API_KEY`).

## 5. Security Checklist

- [x] **Secrets in environment variables:** `.env.example` documented with no hardcoded credentials.
- [x] **Input validation on server:** Routes enforce JSON payload checks and sanitize string lengths.
- [x] **Sandboxed execution boundary:** React and HTML artifacts execute strictly within isolated `<iframe>` containers (`sandbox="allow-scripts allow-modals"`), completely blocking access to parent window cookies, localStorage, and authentication tokens.
- [x] **Authorization rules:** SQL RLS policies enforce `auth.uid() = user_id` across all relational tables.
- [x] **Cascade deletion:** Deleting a conversation removes all associated messages and artifacts.
- [x] **Zero private API calls:** Only standard public APIs and internal Next.js route handlers are utilized.
- [x] **No sensitive user data in logs:** Token streams and prompts are kept within the execution boundary.

## Next Step
Run automated test suite and calculate feature parity score:
`/replica-test`
