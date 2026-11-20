'use client';

import React, { useState } from 'react';
import { Artifact } from '@/types/chat';
import { SandboxedRunner } from './SandboxedRunner';
import {
  Code,
  Eye,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  X,
  Download,
  Terminal,
} from 'lucide-react';

interface ArtifactDrawerProps {
  artifact: Artifact | null;
  onClose: () => void;
}

export function ArtifactDrawer({ artifact, onClose }: ArtifactDrawerProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  if (!artifact) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = artifact.type === 'react' ? 'tsx' : artifact.type === 'html' ? 'html' : artifact.type === 'svg' ? 'svg' : 'txt';
    const blob = new Blob([artifact.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${artifact.identifier}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-surface border-l border-border shadow-pop z-40 flex flex-col transition-all duration-200 ${
        isMaximized ? 'w-full' : 'w-full md:w-[600px] lg:w-[720px]'
      }`}
    >
      {/* Drawer Header */}
      <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-surface shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-1.5 rounded-md bg-accent/10 text-accent shrink-0">
            {artifact.type === 'react' || artifact.type === 'html' ? (
              <Eye className="w-4 h-4" />
            ) : (
              <Terminal className="w-4 h-4" />
            )}
          </div>
          <div className="truncate">
            <h3 className="text-sm font-semibold text-text truncate font-sans">
              {artifact.title}
            </h3>
            <p className="text-xs text-text-muted truncate">
              {artifact.identifier} • {artifact.type.toUpperCase()} • v{artifact.version}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Tab Switcher */}
          <div className="flex items-center bg-bg/80 border border-border rounded-lg p-0.5 mr-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-surface text-text shadow-subtle'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'code'
                  ? 'bg-surface text-text shadow-subtle'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Code
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 text-text-muted hover:text-text hover:bg-bg rounded-md transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 text-text-muted hover:text-text hover:bg-bg rounded-md transition-colors"
            title="Download File"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 text-text-muted hover:text-text hover:bg-bg rounded-md transition-colors hidden sm:block"
            title={isMaximized ? 'Restore Split' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text hover:bg-bg rounded-md transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-hidden p-3 bg-bg">
        {activeTab === 'preview' ? (
          <SandboxedRunner artifact={artifact} />
        ) : (
          <div className="w-full h-full bg-[#18181b] text-neutral-100 rounded-lg p-4 font-mono text-xs overflow-auto select-text leading-relaxed border border-border">
            <pre>
              <code>{artifact.content}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
