'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Paperclip,
  ChevronDown,
  Sparkles,
  Zap,
  Cpu,
  Server,
  Check,
} from 'lucide-react';

interface PromptBoxProps {
  onSubmit: (prompt: string, model: string) => void;
  isLoading: boolean;
  isHero?: boolean;
}

interface ModelOption {
  id: string;
  name: string;
  provider: 'local' | 'cloud';
  description: string;
  badge?: string;
  isOnline?: boolean;
}

const DEFAULT_MODELS: ModelOption[] = [
  {
    id: 'sonnet-3.7',
    name: 'Sonnet 3.7',
    provider: 'cloud',
    description: 'Hybrid reasoning & full artifact execution',
    badge: 'Cloud',
    isOnline: true,
  },
  {
    id: 'haiku-3.5',
    name: 'Haiku 3.5',
    provider: 'cloud',
    description: 'High velocity & rapid prototyping',
    badge: 'Cloud',
    isOnline: true,
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'cloud',
    description: 'Multimodal speed & broad context',
    badge: 'Cloud',
    isOnline: true,
  },
];

export function PromptBox({ onSubmit, isLoading, isHero }: PromptBoxProps) {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('sonnet-3.7');
  const [availableModels, setAvailableModels] = useState<ModelOption[]>(DEFAULT_MODELS);
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch local and cloud models on mount
  useEffect(() => {
    async function loadModels() {
      try {
        const res = await fetch('/api/models');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models) && data.models.length > 0) {
            setAvailableModels(data.models);
            setOllamaOnline(data.ollamaStatus === 'connected');
            // If local model is available, user can select it
            const firstLocal = data.models.find((m: ModelOption) => m.provider === 'local');
            if (firstLocal) {
              setModel(firstLocal.id);
            }
          }
        }
      } catch {
        // Fallback to defaults
      }
    }
    loadModels();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowModelMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim(), model);
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const currentModelObj = availableModels.find((m) => m.id === model) || {
    name: model.replace('ollama:', ''),
    provider: model.startsWith('ollama:') ? 'local' : 'cloud',
  };

  const localModels = availableModels.filter((m) => m.provider === 'local');
  const cloudModels = availableModels.filter((m) => m.provider === 'cloud');

  return (
    <div
      className={`w-full max-w-3xl mx-auto rounded-2xl border border-border bg-surface shadow-card transition-all focus-within:border-accent/40 focus-within:shadow-pop ${
        isHero ? 'p-4' : 'p-3'
      }`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How can Atelier help you build or explore today?"
          rows={isHero ? 3 : 1}
          disabled={isLoading}
          className="w-full bg-transparent text-text placeholder:text-text-muted/60 resize-none outline-none font-sans text-sm md:text-base leading-relaxed px-1"
        />

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          {/* Left: Model Selector & Attachments */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-bg transition-colors"
              title="Attach document or code snippet"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Model Selector Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-bg/80 hover:bg-bg text-xs font-medium text-text transition-colors"
              >
                {currentModelObj.provider === 'local' ? (
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                )}
                <span>
                  {currentModelObj.name}
                  {currentModelObj.provider === 'local' ? ' (Local)' : ''}
                </span>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>

              {showModelMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-72 max-h-96 overflow-y-auto rounded-xl border border-border bg-surface shadow-pop py-1.5 z-30 text-xs">
                  {/* Local Models Header */}
                  {localModels.length > 0 && (
                    <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold text-text-muted border-b border-border/50 bg-bg/40">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                        Local PC Models (Ollama)
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        127.0.0.1:11434
                      </span>
                    </div>
                  )}

                  {localModels.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setModel(m.id);
                        setShowModelMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-bg transition-colors ${
                        model === m.id ? 'bg-bg text-accent font-semibold' : 'text-text'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-text">{m.name}</p>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono">
                            Local
                          </span>
                        </div>
                        <p className="text-[10px] text-text-muted">{m.description}</p>
                      </div>
                      {model === m.id && <Check className="w-3.5 h-3.5 text-accent" />}
                    </button>
                  ))}

                  {/* Cloud Models Header */}
                  <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold text-text-muted border-y border-border/50 bg-bg/40 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-accent" />
                      Cloud Models
                    </span>
                  </div>

                  {cloudModels.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setModel(m.id);
                        setShowModelMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-bg transition-colors ${
                        model === m.id ? 'bg-bg text-accent font-semibold' : 'text-text'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-text">{m.name}</p>
                        <p className="text-[10px] text-text-muted">{m.description}</p>
                      </div>
                      {model === m.id && <Check className="w-3.5 h-3.5 text-accent" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Submit Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              prompt.trim() && !isLoading
                ? 'bg-accent text-on-accent hover:opacity-90 shadow-subtle'
                : 'bg-border text-text-muted/50 cursor-not-allowed'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
