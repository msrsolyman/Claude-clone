import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { parseMessageContent } from '@/lib/artifact-parser';

export async function POST(req: NextRequest) {
  try {
    const { conversationId, messages, model } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const selectedModel = model || 'sonnet-3.7';

    const convId = conversationId || 'conv-' + Date.now();

    // Persist or update conversation
    let conv = db.getConversation(convId);
    if (!conv) {
      conv = {
        id: convId,
        title: lastUserMessage.slice(0, 32) + (lastUserMessage.length > 32 ? '...' : ''),
        model: selectedModel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.saveConversation(conv);
    } else {
      conv.updatedAt = new Date().toISOString();
      conv.model = selectedModel;
      db.saveConversation(conv);
    }

    // Persist incoming user message
    const userMsgId = 'msg-' + Date.now();
    db.saveMessage({
      id: userMsgId,
      conversationId: convId,
      role: 'user',
      content: lastUserMessage,
      createdAt: new Date().toISOString(),
    });

    const assistantMsgId = 'msg-' + (Date.now() + 1);
    const encoder = new TextEncoder();

    // Check if the selected model is a Local Ollama model
    const isLocalOllama =
      selectedModel.startsWith('ollama:') ||
      selectedModel.includes('qwen') ||
      selectedModel.includes('llama') ||
      selectedModel.includes('mistral') ||
      selectedModel.includes('deepseek');

    const ollamaModelName = selectedModel.startsWith('ollama:')
      ? selectedModel.replace('ollama:', '')
      : selectedModel;

    const stream = new ReadableStream({
      async start(controller) {
        let rawResponse = '';

        if (isLocalOllama) {
          try {
            const systemPrompt = `You are Atelier, an AI assistant running locally on the user's PC via Ollama.
Always be concise, precise, and helpful.
When creating interactive UI components, React tools, or web pages, output standard single-file React code inside an artifact tag:
<antArtifact identifier="my-component" type="application/vnd.ant.react" title="Component Title">
import React, { useState } from 'react';

export default function App() {
  return (
    <div className="p-6 bg-white rounded-xl shadow border">
      <h2 className="text-xl font-bold">Hello from Local AI</h2>
    </div>
  );
}
</antArtifact>

You may include reasoning inside <thinking>...</thinking> tags before your main answer.`;

            const ollamaMessages = [
              { role: 'system', content: systemPrompt },
              ...messages.map((m: any) => ({
                role: m.role,
                content: m.content,
              })),
            ];

            const ollamaRes = await fetch('http://127.0.0.1:11434/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: ollamaModelName,
                messages: ollamaMessages,
                stream: true,
              }),
            });

            if (!ollamaRes.ok || !ollamaRes.body) {
              throw new Error(`Ollama returned status ${ollamaRes.status}`);
            }

            const reader = ollamaRes.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                try {
                  const json = JSON.parse(trimmed);
                  const token = json.message?.content || '';
                  if (token) {
                    rawResponse += token;
                    controller.enqueue(encoder.encode(token));
                  }
                } catch {
                  // ignore JSON parse chunk errors
                }
              }
            }

            // Flush any remaining buffer line
            if (buffer.trim()) {
              try {
                const json = JSON.parse(buffer.trim());
                const token = json.message?.content || '';
                if (token) {
                  rawResponse += token;
                  controller.enqueue(encoder.encode(token));
                }
              } catch {}
            }
          } catch (err: any) {
            const errorMsg = `\n\n⚠️ **Local AI Connection Notice:** Could not stream from local Ollama model \`${ollamaModelName}\`. (${err.message}). Ensure Ollama service is running on port 11434.`;
            rawResponse += errorMsg;
            controller.enqueue(encoder.encode(errorMsg));
          }
        } else {
          // Cloud model simulation (with live thinking and artifact extraction)
          const wantsArtifact =
            lastUserMessage.toLowerCase().includes('artifact') ||
            lastUserMessage.toLowerCase().includes('react') ||
            lastUserMessage.toLowerCase().includes('component') ||
            lastUserMessage.toLowerCase().includes('app') ||
            lastUserMessage.toLowerCase().includes('code') ||
            lastUserMessage.toLowerCase().includes('counter') ||
            lastUserMessage.toLowerCase().includes('dashboard');

          const thinkingText = `<thinking>
1. Analyzing user input: "${lastUserMessage}"
2. Selected model execution profile: ${selectedModel}.
3. Formatting structured response.
${
  wantsArtifact
    ? '4. Generating interactive React component with local state and Tailwind CSS.'
    : '4. Providing clear markdown formatted answer.'
}
5. Verifying sandboxed execution constraints.
</thinking>\n\n`;

          for (const char of thinkingText) {
            rawResponse += char;
            controller.enqueue(encoder.encode(char));
            await new Promise((r) => setTimeout(r, 6));
          }

          let mainContent = `I have processed your request in Atelier. `;

          if (wantsArtifact) {
            mainContent +=
              `Here is your interactive component ready for live preview.\n\n` +
              `<antArtifact identifier="interactive-counter-app" type="application/vnd.ant.react" title="Interactive Analytics Counter">
import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(10);
  const [history, setHistory] = useState([10]);

  const increment = () => {
    setCount(prev => {
      const next = prev + 1;
      setHistory(h => [next, ...h.slice(0, 4)]);
      return next;
    });
  };

  const decrement = () => {
    setCount(prev => {
      const next = Math.max(0, prev - 1);
      setHistory(h => [next, ...h.slice(0, 4)]);
      return next;
    });
  };

  const reset = () => {
    setCount(0);
    setHistory([0]);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-neutral-200 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-lg font-bold text-neutral-800">Live Pulse Metric</h2>
          <p className="text-xs text-neutral-500">Real-time reactive counter</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
          Active
        </span>
      </div>

      <div className="my-8 text-center">
        <div className="text-5xl font-black text-neutral-900 tracking-tight transition-all">
          {count}
        </div>
        <p className="text-xs text-neutral-400 mt-1">Current Metric Value</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={decrement}
          className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-xl text-sm transition-colors active:scale-95"
        >
          - Decrement
        </button>
        <button
          onClick={increment}
          className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-md active:scale-95"
        >
          + Increment
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={reset}
          className="text-xs text-neutral-400 hover:text-neutral-600 underline"
        >
          Reset to Zero
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100">
        <p className="text-xs font-medium text-neutral-500 mb-2">Recent Changes:</p>
        <div className="flex gap-2">
          {history.map((val, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-neutral-50 border border-neutral-200 rounded text-neutral-600 font-mono"
            >
              {val}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
</antArtifact>\n\nYou can click the Artifact card to inspect the interactive preview in the right drawer.`;
          } else {
            mainContent += `Atelier is ready to assist you. You can build interactive prototypes, generate code, explore architectures, or test prompts across multiple models. Try asking: **"Build an interactive dashboard component"** to see live Artifacts in action!`;
          }

          const chunkSize = 6;
          for (let i = 0; i < mainContent.length; i += chunkSize) {
            const chunk = mainContent.slice(i, i + chunkSize);
            rawResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
            await new Promise((r) => setTimeout(r, 12));
          }
        }

        // Parse any artifacts and thinking blocks generated
        const parsed = parseMessageContent(rawResponse, assistantMsgId);

        db.saveMessage({
          id: assistantMsgId,
          conversationId: convId,
          role: 'assistant',
          content: parsed.cleanContent,
          thinking: parsed.thinking,
          createdAt: new Date().toISOString(),
        });

        for (const art of parsed.artifacts) {
          db.saveArtifact({
            ...art,
            conversationId: convId,
            messageId: assistantMsgId,
          });
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
