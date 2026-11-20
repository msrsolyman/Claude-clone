'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Brain } from 'lucide-react';

interface ThinkingAccordionProps {
  thinking: string;
  isStreaming?: boolean;
}

export function ThinkingAccordion({ thinking, isStreaming }: ThinkingAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking) return null;

  return (
    <div className="mb-4 rounded-lg border border-border bg-surface/40 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-text-muted hover:text-text hover:bg-surface/80 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Brain className={`w-3.5 h-3.5 ${isStreaming ? 'text-accent animate-pulse' : 'text-text-muted'}`} />
          <span className="font-medium">
            {isStreaming ? 'Thinking...' : 'Thought process'}
          </span>
          {isStreaming && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          )}
        </div>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-text-muted" />}
      </button>

      {isOpen && (
        <div className="px-3.5 py-3 border-t border-border bg-bg/50 text-text-muted font-sans text-xs whitespace-pre-wrap leading-relaxed select-text">
          {thinking}
        </div>
      )}
    </div>
  );
}
