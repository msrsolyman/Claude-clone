-- PostgreSQL Schema for Claude Replica
-- Designed for Supabase / Neon / Local PostgreSQL with RLS and cascade rules

create extension if not exists "pgcrypto";

-- 1. Users Table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  avatar_url text,
  api_provider text not null default 'anthropic' check (api_provider in ('anthropic', 'gemini', 'openai')),
  custom_api_key text,
  theme text not null default 'warm-dark' check (theme in ('warm-dark', 'warm-light', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_users_email on users (email);

-- 2. Projects (Knowledge Base) Table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  custom_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_projects_user on projects (user_id);

-- 3. Project Documents (Knowledge Files) Table
create table if not exists project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  file_name text not null,
  file_size bigint not null default 0,
  mime_type text not null default 'text/plain',
  text_content text not null,
  created_at timestamptz not null default now()
);
create index idx_project_docs_project on project_documents (project_id);

-- 4. Conversations (Chat Threads) Table
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  title text not null default 'New Chat',
  model text not null default 'claude-3-7-sonnet',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_conversations_user on conversations (user_id, updated_at desc);
create index idx_conversations_project on conversations (project_id);

-- 5. Messages Table (Supporting branching history)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  thinking text,
  parent_id uuid references messages(id) on delete cascade,
  tokens_used integer,
  created_at timestamptz not null default now()
);
create index idx_messages_conversation on messages (conversation_id, created_at asc);
create index idx_messages_parent on messages (parent_id);

-- 6. Artifacts Table (Live interactive snippets)
create table if not exists artifacts (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  message_id uuid not null references messages(id) on delete cascade,
  identifier text not null,
  title text not null,
  type text not null check (type in ('code', 'react', 'svg', 'markdown', 'html')),
  language text not null default 'plaintext',
  content text not null,
  version integer not null default 1,
  created_at timestamptz not null default now()
);
create index idx_artifacts_message on artifacts (message_id);
create index idx_artifacts_conversation on artifacts (conversation_id, identifier);

-- Row-Level Security (RLS) Policies
alter table users enable row level security;
alter table projects enable row level security;
alter table project_documents enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table artifacts enable row level security;

-- Example RLS Policy for Users (owner check)
create policy "Users can manage own account"
  on users for all
  using (auth.uid() = id);

create policy "Users can manage own projects"
  on projects for all
  using (auth.uid() = user_id);

create policy "Users can manage own project documents"
  on project_documents for all
  using (exists (select 1 from projects where projects.id = project_documents.project_id and projects.user_id = auth.uid()));

create policy "Users can manage own conversations"
  on conversations for all
  using (auth.uid() = user_id);

create policy "Users can manage own messages"
  on messages for all
  using (exists (select 1 from conversations where conversations.id = messages.conversation_id and conversations.user_id = auth.uid()));

create policy "Users can manage own artifacts"
  on artifacts for all
  using (exists (select 1 from conversations where conversations.id = artifacts.conversation_id and conversations.user_id = auth.uid()));
