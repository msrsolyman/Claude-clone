'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PromptBox } from '@/components/PromptBox';
import { ArtifactDrawer } from '@/components/ArtifactDrawer';
import { ThinkingAccordion } from '@/components/ThinkingAccordion';
import { ChatMessage, Artifact, Conversation } from '@/types/chat';
import { parseMessageContent } from '@/lib/artifact-parser';
import {
  Code,
  Layout,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize theme
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load conversations on mount
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to load sessions', err);
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchConversations();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setActiveArtifact(null);
  };

  const handleSelectConversation = async (id: string) => {
    setActiveChatId(id);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        const allArtifacts = (data.messages || []).flatMap((m: ChatMessage) => m.artifacts || []);
        if (allArtifacts.length > 0) {
          setActiveArtifact(allArtifacts[allArtifacts.length - 1]);
        } else {
          setActiveArtifact(null);
        }
      }
    } catch (err) {
      console.error('Failed to load session details', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (prompt: string, model: string) => {
    const userMsgId = 'msg-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString(),
    };

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);

    let currentChatId = activeChatId;
    if (!currentChatId) {
      currentChatId = 'conv-' + Date.now();
      setActiveChatId(currentChatId);
    }

    const assistantMsgId = 'msg-' + (Date.now() + 1);
    const assistantPlaceholder: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      thinking: '',
      createdAt: new Date().toISOString(),
    };

    setMessages([...newMessages, assistantPlaceholder]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentChatId,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          model,
        }),
      });

      if (!response.body) throw new Error('No stream body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let rawAccumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        rawAccumulated += decoder.decode(value, { stream: true });
        const parsed = parseMessageContent(rawAccumulated, assistantMsgId);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: parsed.cleanContent,
                  thinking: parsed.thinking,
                  artifacts: parsed.artifacts,
                }
              : m
          )
        );

        if (parsed.artifacts.length > 0 && !activeArtifact) {
          setActiveArtifact(parsed.artifacts[parsed.artifacts.length - 1]);
        }
      }

      fetchConversations();
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: 'Error streaming response: ' + err.message }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text">
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeChatId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content View */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {messages.length === 0 ? (
          /* S02: Home / New Session View */
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-2xl space-y-8 my-auto">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent mx-auto flex items-center justify-center font-serif text-2xl font-bold shadow-subtle">
                  A
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-normal text-text tracking-tight">
                  Welcome to Atelier.
                </h1>
                <p className="text-text-muted text-sm max-w-md mx-auto">
                  The local-first workbench for interactive code, artifacts, and multi-model intelligence.
                </p>
              </div>

              {/* Central Hero Prompt Box */}
              <PromptBox onSubmit={handleSendMessage} isLoading={isLoading} isHero />

              {/* Prompt Starters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left pt-2">
                <button
                  onClick={() =>
                    handleSendMessage('Create an interactive metric counter component in React', 'sonnet-3.7')
                  }
                  className="p-3.5 rounded-xl border border-border bg-surface hover:border-accent/50 transition-all text-xs group shadow-subtle"
                >
                  <p className="font-semibold text-text group-hover:text-accent transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    Interactive Component
                  </p>
                  <p className="text-text-muted mt-1">
                    Build a real-time reactive counter with live preview
                  </p>
                </button>

                <button
                  onClick={() =>
                    handleSendMessage('Explain how local-first sandboxing keeps my tokens private', 'sonnet-3.7')
                  }
                  className="p-3.5 rounded-xl border border-border bg-surface hover:border-accent/50 transition-all text-xs group shadow-subtle"
                >
                  <p className="font-semibold text-text group-hover:text-accent transition-colors flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-accent" />
                    Local Privacy & Security
                  </p>
                  <p className="text-text-muted mt-1">
                    Learn about isolated iframe execution and BYOK encryption
                  </p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* S03: Session Thread View */
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* User Message Bubble */}
                  {msg.role === 'user' ? (
                    <div className="max-w-xl bg-surface border border-border px-4 py-3 rounded-2xl rounded-tr-sm text-text text-sm md:text-base leading-relaxed shadow-subtle">
                      {msg.content}
                    </div>
                  ) : (
                    /* Assistant Message */
                    <div className="w-full space-y-3">
                      {msg.thinking && (
                        <ThinkingAccordion
                          thinking={msg.thinking}
                          isStreaming={isLoading && !msg.content}
                        />
                      )}

                      <div className="text-text text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.content}
                      </div>

                      {/* Inline Artifacts Cards */}
                      {msg.artifacts && msg.artifacts.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.artifacts.map((art) => (
                            <div
                              key={art.id}
                              onClick={() => setActiveArtifact(art)}
                              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface hover:border-accent/60 cursor-pointer transition-all shadow-subtle group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:scale-105 transition-transform">
                                  {art.type === 'react' ? (
                                    <Layout className="w-4 h-4" />
                                  ) : (
                                    <Code className="w-4 h-4" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-text group-hover:text-accent transition-colors font-sans">
                                    {art.title}
                                  </h4>
                                  <p className="text-xs text-text-muted">
                                    Click to open in interactive side-panel ({art.type.toUpperCase()})
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-medium text-accent flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                Open <ExternalLink className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Message Action Bar */}
                      <div className="flex items-center gap-2 pt-1 text-text-muted">
                        <button
                          onClick={() => copyMessage(msg.id, msg.content)}
                          className="p-1 hover:text-text rounded transition-colors text-xs flex items-center gap-1"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-success" />
                              <span className="text-[10px] text-success">Copied</span>
                            </>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Sticky Bottom Prompt Box */}
        {messages.length > 0 && (
          <div className="p-4 border-t border-border bg-bg/80 backdrop-blur-md shrink-0">
            <PromptBox onSubmit={handleSendMessage} isLoading={isLoading} />
          </div>
        )}

        {/* S04: Right Artifacts Drawer */}
        <ArtifactDrawer
          artifact={activeArtifact}
          onClose={() => setActiveArtifact(null)}
        />
      </main>
    </div>
  );
}
