# Architecture: Claude Replica (Rebuild of Claude.ai Core Features)

Scope: Core Chat Loop, Interactive Artifacts Side-Panel, and Projects Knowledge Base
Recon Source: `replica/recon.md` and `replica/features.csv`
Date: 2026-11-20

## 1. Stack

| layer | choice | why |
| --- | --- | --- |
| web | Next.js 15 (App Router) + TypeScript | React Server Components, fast streaming UI primitives, and integrated route handlers |
| styling | Tailwind CSS + Lucide React + Radix UI | Component-level token styling matching Claude's warm minimalist typography and layout |
| ai integration | Vercel AI SDK (`ai` + `@ai-sdk/anthropic` / `@ai-sdk/google`) | Standardized streaming protocol (`toDataStreamResponse`), tool/artifact parsing, and provider switching |
| live runner | Sandboxed `<iframe>` with Babel Standalone & Tailwind CDN | Zero-backend in-browser compilation and isolated execution of React, HTML, SVG, and Mermaid |
| database | PostgreSQL (Supabase / Neon / Local Docker) + Drizzle ORM | Relational integrity for branched message trees, RLS security, and low cold-start latency |
| auth | Supabase Auth or NextAuth.js (Auth.js v5) | Secure session management, email magic links, and Google OAuth |
| storage | Supabase Storage / Local disk / S3-compatible | Secure document and attachment storage for project knowledge bases |
| jobs | Vercel Cron or Inngest | Lightweight scheduled cleanup of ephemeral guest sessions and usage calculation |
| hosting | Vercel or Node.js Docker | Native HTTP streaming support without proxy buffer interruptions |

## 2. Schema

PostgreSQL with Row Level Security (RLS) enabled on all tables.
Full SQL definition resides in [schema.sql](file:///D:/Claude/replica/schema.sql).

### Table Summary:
1. `users` — account credentials, theme preference, BYOK API keys (`anthropic`, `gemini`, `openai`).
2. `projects` — custom knowledge containers, system prompts, ownership.
3. `project_documents` — uploaded knowledge files, extracted plain text, file metadata.
4. `conversations` — chat sessions, title, associated project, model selector state, pinning.
5. `messages` — individual chat turns (`user`, `assistant`, `system`), reasoning tokens (`thinking`), and `parent_id` for recursive branch trees.
6. `artifacts` — extracted code/component objects, versions, languages, and identifiers.

### Data Access & Constraints:
- Access Rules: Postgres Row Level Security (RLS) ensuring `auth.uid() = user_id`.
- Referential Integrity: Cascade deletion on messages, artifacts, and project documents.
- Concurrency & Constraints: Unique constraint on `(conversation_id, identifier, version)` preventing duplicate artifact revisions.

## 3. API & Routes

### Flow F01: Ask prompt & stream response
| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/chat` | Streams LLM completion chunks & parses artifacts in real-time | User | `{ conversationId, messages, model, projectId? }` | SSE Data Stream (`text-stream`, `reasoning`) | F01 |
| `POST /api/conversations` | Creates or initializes a new chat thread | User | `{ title, model, projectId? }` | `Conversation` JSON | F01 |
| `GET /api/conversations` | Lists user's recent and pinned conversations | User | - | `Conversation[]` | F01 |
| `GET /api/conversations/:id` | Loads conversation messages with branch state | User | `id: uuid` | `{ conversation, messages, artifacts }` | F01 |

### Flow F02: Generate & inspect Artifact
| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/artifacts/:id` | Fetches specific artifact code and metadata | User | `id: uuid` | `Artifact` JSON | F02 |
| `GET /api/conversations/:id/artifacts` | Lists all artifacts created within this chat | User | `id: uuid` | `Artifact[]` | F02 |
| `POST /api/artifacts/:id/fork` | Saves an edited iteration as a new version | User | `{ content, title }` | Updated `Artifact` JSON | F02 |

### Flow F03: Create Project & attach Knowledge Base
| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/projects` | Creates a new project workspace | User | `{ title, description, customInstructions }` | `Project` JSON | F03 |
| `GET /api/projects` | Lists all projects belonging to user | User | - | `Project[]` | F03 |
| `GET /api/projects/:id` | Gets project details, instructions, and docs | User | `id: uuid` | `{ project, documents, chats }` | F03 |
| `POST /api/projects/:id/docs` | Uploads file and parses text content into DB | User | `multipart/form-data (file)` | `ProjectDoc` JSON | F03 |
| `DELETE /api/projects/:id/docs/:docId` | Removes knowledge document from project | User | `id, docId` | `{ success: true }` | F03 |

### Flow F04: Edit message & branch conversation
| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/messages/:id/branch` | Creates an alternative message branch from parent | User | `{ newContent, model }` | SSE Data Stream for new branch | F04 |
| `GET /api/messages/:id/branches` | Fetches siblings sharing the same `parent_id` | User | `id: uuid` | `Message[]` (sibling variants) | F04 |

### Settings & User Keys
| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/settings/keys` | Encrypts and saves user's BYOK API key | User | `{ provider, apiKey }` | `{ success: true }` | S07 |
| `PATCH /api/settings/profile` | Updates theme, user name, default model | User | `{ theme, defaultModel }` | Updated profile JSON | S07 |

## 4. The Parts That Bite

- **Realtime Stream Parsing:** The model outputs standard Markdown along with `<antArtifact identifier="..." type="..." title="...">...code...</antArtifact>`. The client stream reader must parse tokens incrementally without breaking incomplete code blocks or freezing the UI thread.
- **Sandboxed Execution Security:** In-browser React preview allows running arbitrary JavaScript. It must be hosted in an isolated `iframe` with `sandbox="allow-scripts"` (strictly excluding `allow-same-origin`) to prevent access to authentication cookies, local storage, or API credentials.
- **Branching History Graph:** Unlike linear chats, branching turns messages into a tree. The data query must retrieve the active path efficiently using recursive CTEs or parent-child pointers (`parent_id`).
- **File Upload Limits & Context Overflow:** Document uploads for Projects can exceed LLM context windows. Text must be truncated or summarized with clear token estimations before injecting into the prompt.
- **Rate Limits & Failover:** API calls to Anthropic or Gemini might encounter 429 rate limits; the API layer must handle exponential backoff and surface user-friendly retry banners.

## 5. Build Order

### Milestone 1: Vertical Slice (The Core Loop)
* **Goal:** A working chat with real-time streaming and a split-screen Artifact drawer rendering live React/HTML.
* **Screens:** S02 (Home/New Chat), S03 (Chat Thread), S04 (Artifacts Split-View).
* **Tables:** `conversations`, `messages`, `artifacts`.
* **Routes:** `POST /api/chat`, `GET /api/conversations/:id`.

### Milestone 2: Must-Haves (Persistence & Parity)
* **Goal:** Full conversation persistence, model selection, reasoning/thinking accordion, and sidebar navigation.
* **Screens:** S01 (Auth), S02, S03, S04.
* **Tables:** `users`, `conversations`, `messages`, `artifacts`.
* **Routes:** `GET /api/conversations`, `POST /api/conversations`, `POST /api/settings/keys`.

### Milestone 3: Should-Haves (Projects & Advanced UX)
* **Goal:** Projects knowledge base with file upload, branch editing for past messages, and warm dark/light themes.
* **Screens:** S05 (Projects Dashboard), S06 (Project Detail & Chat), S07 (Settings).
* **Tables:** `projects`, `project_documents`.
* **Routes:** `POST /api/projects`, `POST /api/projects/:id/docs`, `POST /api/messages/:id/branch`.

### Milestone 4: Polish & Parity (Could-Haves)
* **Goal:** Full-text chat search, ZIP export of multi-file artifacts, and keyboard shortcuts (`Cmd+K`, `Cmd+Enter`).
