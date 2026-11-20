import { NextResponse } from 'next/server';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'local' | 'cloud';
  description: string;
  badge?: string;
  isOnline?: boolean;
}

const DEFAULT_CLOUD_MODELS: ModelOption[] = [
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

export async function GET() {
  const localModels: ModelOption[] = [];
  let isOllamaRunning = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('http://127.0.0.1:11434/api/tags', {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      isOllamaRunning = true;
      if (Array.isArray(data.models)) {
        for (const m of data.models) {
          const paramSize = m.details?.parameter_size ? ` (${m.details.parameter_size})` : '';
          localModels.push({
            id: `ollama:${m.name}`,
            name: m.name,
            provider: 'local',
            description: `Local Ollama model on PC${paramSize}`,
            badge: 'Local PC',
            isOnline: true,
          });
        }
      }
    }
  } catch {
    isOllamaRunning = false;
  }

  return NextResponse.json({
    ollamaStatus: isOllamaRunning ? 'connected' : 'offline',
    models: [...localModels, ...DEFAULT_CLOUD_MODELS],
  });
}
