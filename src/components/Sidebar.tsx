'use client';

import React from 'react';
import { Conversation } from '@/types/chat';
import {
  MessageSquare,
  Plus,
  FolderKanban,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  theme,
  onToggleTheme,
}: SidebarProps) {
  return (
    <aside className="w-64 h-full bg-surface border-r border-border flex flex-col shrink-0 select-none">
      {/* Top Header / Brand */}
      <div className="h-14 px-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-on-accent font-serif font-bold text-sm shadow-subtle">
            A
          </div>
          <span className="font-serif font-semibold text-lg text-text tracking-tight">
            Atelier
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">
            AI
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          className="p-1.5 text-text-muted hover:text-text hover:bg-bg rounded-md transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Start New Chat CTA */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border bg-bg hover:border-accent/50 text-text font-medium text-sm transition-all shadow-subtle group"
        >
          <div className="flex items-center gap-2.5">
            <Plus className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            <span>New Session</span>
          </div>
          <span className="text-xs text-text-muted font-mono opacity-70">⌘K</span>
        </button>
      </div>

      {/* Projects Section */}
      <div className="px-3 pt-2">
        <div className="flex items-center justify-between text-xs font-medium text-text-muted px-2 py-1">
          <span>Workspaces</span>
          <FolderKanban className="w-3.5 h-3.5" />
        </div>
        <div className="mt-1 space-y-1">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-text-muted hover:bg-bg hover:text-text cursor-pointer transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="truncate">Default Workspace</span>
          </div>
        </div>
      </div>

      {/* Recent Chats Section */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-xs font-medium text-text-muted px-2 py-1">
          Recent Sessions
        </div>

        {conversations.length === 0 ? (
          <div className="px-2 py-4 text-xs text-text-muted text-center italic">
            No sessions yet. Start one above!
          </div>
        ) : (
          conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectConversation(chat.id)}
              className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeId === chat.id
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-text-muted hover:bg-bg hover:text-text'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span className="truncate flex-1">{chat.title}</span>
            </button>
          ))
        )}
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t border-border bg-surface shrink-0">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-bg cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center text-xs font-semibold text-text">
              U
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-text truncate">User Workspace</p>
              <p className="text-[10px] text-text-muted truncate">Local-First / BYOK</p>
            </div>
          </div>
          <Settings className="w-4 h-4 text-text-muted" />
        </div>
      </div>
    </aside>
  );
}
