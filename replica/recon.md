# Recon map: Claude.ai (Web)

Scope: Core Chat Loop, Interactive Artifacts, and Projects Knowledge Base
For: Developer / AI productivity web application
Date: 2026-11-20

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Help Center / Support | https://support.anthropic.com/ | Artifacts documentation, Projects guides, system prompt behavior |
| 2 | Product & Features Page | https://claude.ai/ | Landing page, core UI layout, feature highlights |
| 3 | Anthropic API Documentation | https://docs.anthropic.com/ | Message streaming format, thinking tokens, tool use, token limits |
| 4 | Changelog & Announcements | https://www.anthropic.com/news | Artifacts release, Projects feature, Computer Use / Analysis tool |

## Core loop

The user types a prompt (with optional attached files/code), the LLM generates a streamed response with reasoning/markdown, and interactive code/components render live in a split-screen Artifacts drawer.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Auth / Sign-in | `/login` | User authentication via OAuth / Email | OAuth buttons, email magic link input | default, loading, error |
| S02 | Home / New Chat | `/` or `/new` | Starting a new conversation | Hero greeting, PromptBox, ModelSelector, Recents list | empty, filled, model-selected |
| S03 | Chat Thread | `/chat/:id` | Active conversation thread with streaming replies | SidebarNav, ChatMessage list, ThinkingBlock, PromptBox | empty, streaming, completed, error |
| S04 | Artifacts Split-View | `/chat/:id` (triggered by artifact) | Side-by-side view to inspect and run code/designs | SplitPane, ArtifactDrawer, CodeEditor, SandboxedPreview, VersionPicker | loading sandbox, rendered, error |
| S05 | Projects Dashboard | `/projects` | Manage project workspaces and persistent knowledge | ProjectCard grid, CreateProjectModal | empty, populated |
| S06 | Project Detail & Chat | `/project/:id` | Project-scoped chat with custom context/docs | ProjectHeader, KnowledgeDocList, ProjectChatList, PromptBox | empty docs, populated docs, active chat |
| S07 | User Settings | `/settings` (Modal) | Profile, API key configuration, appearance | ThemeToggle, APIKeyInput, UsageQuota, AccountDetails | default, saved, invalid key |

## Flows

```
F01 Ask prompt and stream response
    S02 (New Chat) -> enter prompt -> S03 (Chat Thread) -> streaming chunks -> response complete
    happy path clicks: 2 (type prompt, press Enter/Send)
    edge: rate limit exceeded, network disconnect during stream, token truncation

F02 Generate and inspect Artifact
    S03 (Chat Thread) -> model triggers artifact block -> S04 (Artifacts Split-View opens automatically) -> toggle Code / Live Preview
    happy path clicks: 1 (automatic open or 1 click on artifact card)
    edge: sandbox execution crash, unsupported language preview, responsive resize

F03 Create Project and attach Knowledge Base
    S02 -> S05 (Projects) -> Click 'New Project' -> Set title & system prompt -> S06 (Project Detail) -> Upload reference docs -> Start chat
    happy path clicks: 5
    edge: file size limit exceeded, unsupported binary format, parsing failure

F04 Edit message & branch conversation
    S03 (Chat Thread) -> Hover on user message -> Click Edit -> Modify prompt -> Resend -> Creates new branch timeline
    happy path clicks: 3
    edge: navigating back to previous branch versions
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| PromptBox | home-hero, thread-bottom | default, active/typing, file-attached, disabled | S02, S03, S06 |
| ChatMessage | user, assistant, system | sending, streaming, completed, error | S03, S06 |
| ThinkingAccordion | collapsed, expanded | thinking-active, complete | S03 |
| ArtifactCard | embedded in chat | collapsed, expanded, active | S03 |
| ArtifactDrawer | full-height right panel | closed, open-code, open-preview, maximized | S04 |
| SandboxedPreview | iframe runner (React/HTML/SVG) | loading, rendered, runtime-error | S04 |
| SidebarNav | expanded, collapsed | active-item, hover, mobile-overlay | S02, S03, S05, S06 |
| ModelSelector | pill dropdown | open, closed, option-active | S02, S03 |
| AttachmentChip | document, code, image | uploading, ready, error, removable | S02, S03 |
| ThemeToggle | light, dark, system | active | S07 |

## Inferred data model

```
User          id, email, name, avatar_url, api_provider (anthropic|gemini|openai), custom_api_key, created_at
              evidence: S01 auth, S07 settings
              confidence: high

Project       id, user_id, title, description, custom_instructions, created_at, updated_at
              evidence: S05 projects list, S06 project settings
              confidence: high

ProjectDoc    id, project_id, file_name, file_size, mime_type, text_content, created_at
              evidence: S06 project knowledge attachments
              confidence: high

Conversation  id, user_id, project_id (nullable), title, model, created_at, updated_at
              evidence: S02 recents sidebar, S03 chat URL param
              confidence: high

Message       id, conversation_id, role (user|assistant|system), content, thinking, parent_id, version, created_at
              evidence: S03 chat message stream, branch editing
              confidence: high

Artifact      id, conversation_id, message_id, identifier, title, type (code|react|svg|markdown|html), language, content, version, created_at
              evidence: S04 artifact drawer, version history
              confidence: high
```

Relationships:
- User 1-n Project
- Project 1-n ProjectDoc
- User 1-n Conversation
- Project 1-n Conversation (optional)
- Conversation 1-n Message
- Message 1-n Artifact

## Feature matrix

See `features.csv`.
- Must: 10
- Should: 6
- Could: 4
- Skip: 2

## Out of scope (cannot or should not be cloned)

- Proprietary Anthropic backend model weights and internal pre-training infrastructure. (We consume official Anthropic/Gemini APIs instead).
- Claude for Work / Enterprise SSO directory sync (SCIM/Okta enterprise federation is out of initial scope).

## Size

Screens: 7, Flows: 4, Entities: 6.
Hard parts:
1. Real-time token streaming with Markdown formatting and simultaneous Artifact detection.
2. Safe in-browser Sandboxed Execution (Sandboxed iframe with live React / Tailwind / HTML / SVG compilation).
3. Conversation branching & message history tree management.

Size: **M (2-3 weeks for full polished implementation; 1-2 days for core chat + artifacts vertical slice)**.
