# Test plan: Claude Replica

Build: Local Production Build (Next.js 15)  Date: 2026-11-20  Env: Local `http://localhost:3000`, seed data

| case | flow | type | steps | expected | auto | result |
| --- | --- | --- | --- | --- | --- | --- |
| S02-H1 | Home / App Shell | happy | GET `/` | 200 OK, title 'Claude', Sidebar & PromptBox visible | e2e | PASS |
| F01-H1 | Ask prompt & stream | happy | POST `/api/chat` with text prompt | SSE stream chunks, `<thinking>` accordion tokens, clean prose | e2e | PASS |
| F01-E1 | Long prompt edge case | edge | POST `/api/chat` with 5,000+ characters | Handles payload gracefully without buffer overflow or 500 | e2e | PASS |
| F02-H1 | Artifact generation | happy | POST `/api/chat` requesting React component | Returns `<antArtifact>` with React TSX code and metadata | e2e | PASS |
| F02-H2 | Sandboxed Execution | happy | Open artifact in drawer | Babel compiles JSX, iframe renders interactive component | manual/e2e | PASS |
| F02-H3 | Code vs Preview tab | happy | Toggle Code tab in drawer | Shows syntax highlighted code block, copy & download | manual | PASS |
| F03-H1 | Projects list | happy | GET `/api/projects` | 200 OK, returns array of workspace projects | e2e | PASS |
| F03-H2 | Create project | happy | POST `/api/projects` | 200 OK, returns newly created project with ID | e2e | PASS |
| F04-H1 | List conversations | happy | GET `/api/conversations` | 200 OK, reverse chronological list of user chats | e2e | PASS |
| F04-H2 | Load chat thread | happy | GET `/api/conversations/:id` | 200 OK, returns conversation, messages, and artifacts | e2e | PASS |
| F04-N1 | Conversation not found | negative | GET `/api/conversations/conv-not-found-9999` | 404 Not Found error response | e2e | PASS |
| UI-H1 | Warm Theme Toggle | happy | Click Sun/Moon icon in sidebar | Toggles `dark` class on root HTML, switches palettes | manual | PASS |
| UI-H2 | Model Selection | happy | Switch dropdown to Claude 3.5 Haiku / Gemini | Updates pill state and sends selected model in request | manual | PASS |
