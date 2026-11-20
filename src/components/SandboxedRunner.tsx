'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Artifact } from '@/types/chat';
import { AlertCircle } from 'lucide-react';

interface SandboxedRunnerProps {
  artifact: Artifact;
}

export function SandboxedRunner({ artifact }: SandboxedRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setLoading] = useState(true);

  const generateSrcDoc = () => {
    const isReact = artifact.type === 'react' || artifact.language === 'tsx' || artifact.language === 'jsx';
    const isSvg = artifact.type === 'svg';

    if (isSvg) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; padding: 24px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; font-family: sans-serif; }
              svg { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>${artifact.content}</body>
        </html>
      `;
    }

    if (!isReact) {
      // Plain HTML
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>body { margin: 0; padding: 16px; font-family: sans-serif; }</style>
          </head>
          <body>
            ${artifact.content}
          </body>
        </html>
      `;
    }

    // React Application Runner using Babel Standalone and React 18 UMD
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            #error-root { color: #dc2626; padding: 16px; border: 1px solid #fecaca; background: #fef2f2; border-radius: 8px; font-family: monospace; display: none; white-space: pre-wrap; font-size: 13px; }
          </style>
        </head>
        <body>
          <div id="error-root"></div>
          <div id="root"></div>

          <script>
            window.onerror = function(msg, url, line, col, err) {
              var errDiv = document.getElementById('error-root');
              if (errDiv) {
                errDiv.style.display = 'block';
                errDiv.innerText = 'Runtime Error: ' + msg + (line ? ' (Line ' + line + ')' : '');
              }
              window.parent.postMessage({ type: 'ARTIFACT_ERROR', error: msg }, '*');
              return true;
            };
          </script>

          <script type="text/babel" data-presets="react,typescript">
            const { useState, useEffect, useRef, useMemo, useCallback } = React;

            try {
              ${sanitizeReactCode(artifact.content)}

              const ComponentToRender = 
                (typeof App !== 'undefined' ? App : null) ||
                (typeof window !== 'undefined' && window.App ? window.App : null) ||
                (typeof Component !== 'undefined' ? Component : null);

              if (ComponentToRender) {
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<ComponentToRender />);
              } else {
                document.getElementById('root').innerHTML = '<div class="p-4 text-neutral-500">No export default or App component found to render.</div>';
              }
            } catch (err) {
              const errDiv = document.getElementById('error-root');
              if (errDiv) {
                errDiv.style.display = 'block';
                errDiv.innerText = 'Compilation Error: ' + err.message;
              }
              window.parent.postMessage({ type: 'ARTIFACT_ERROR', error: err.message }, '*');
            }
          </script>
        </body>
      </html>
    `;
  };

  useEffect(() => {
    setError(null);
    setLoading(true);

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ARTIFACT_ERROR') {
        setError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [artifact.content]);

  return (
    <div className="relative w-full h-full bg-white dark:bg-neutral-900 rounded-b-lg overflow-hidden flex flex-col">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900 p-3 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="overflow-x-auto whitespace-pre-wrap">{error}</div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        key={artifact.id + '-' + artifact.version}
        srcDoc={generateSrcDoc()}
        sandbox="allow-scripts allow-modals"
        className="w-full h-full border-none flex-1 bg-white"
        title={artifact.title}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

function sanitizeReactCode(code: string): string {
  // Strip import statements
  let clean = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');

  // Replace "export default function [Name]" -> "function [Name]"
  clean = clean.replace(/export\s+default\s+function(?:\s+([A-Za-z0-9_$]+))?/g, (_, name) => {
    const fnName = name || 'App';
    return `function ${fnName}`;
  });

  // Replace "export default [Name];" -> "window.App = [Name];"
  clean = clean.replace(/export\s+default\s+([A-Za-z0-9_$]+);?/g, 'window.App = $1;');

  // Remove any remaining "export "
  clean = clean.replace(/export\s+/g, '');

  return clean;
}
