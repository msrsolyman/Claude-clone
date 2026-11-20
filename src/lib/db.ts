import fs from 'fs';
import path from 'path';
import { Conversation, ChatMessage, Artifact, Project } from '@/types/chat';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

export interface DbSchema {
  users: Array<{
    id: string;
    email: string;
    name: string;
    apiProvider: string;
    customApiKey?: string;
    theme: string;
    createdAt: string;
  }>;
  projects: Project[];
  conversations: Conversation[];
  messages: Array<ChatMessage & { conversationId: string; parentId?: string }>;
  artifacts: Array<Artifact & { conversationId: string; messageId: string }>;
}

function getInitialData(): DbSchema {
  return {
    users: [
      {
        id: 'usr-default',
        email: 'developer@example.com',
        name: 'Developer',
        apiProvider: 'default-provider',
        theme: 'warm-dark',
        createdAt: new Date().toISOString(),
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Artifacts Sandbox',
        description: 'Interactive components and UI design experiments',
        customInstructions: 'Always generate React code inside <antArtifact> tags with Tailwind CSS.',
        documentsCount: 2,
        createdAt: new Date().toISOString(),
      },
    ],
    conversations: [
      {
        id: 'conv-seed-1',
        title: 'Building Interactive Counter',
        model: 'sonnet-3.7',
        isPinned: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    messages: [
      {
        id: 'msg-seed-1',
        conversationId: 'conv-seed-1',
        role: 'user',
        content: 'Create an interactive metric counter component in React',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'msg-seed-2',
        conversationId: 'conv-seed-1',
        role: 'assistant',
        content: `Here is your counter component ready to run:\n\n> 📦 **Artifact Created:** [Interactive Analytics Counter](#artifact-interactive-counter-app)\n\nYou can click the Artifact card or inspect the interactive preview on the right drawer.`,
        thinking: '1. User asked for a counter\n2. Creating reactive state with history\n3. Applying clean Tailwind layout',
        createdAt: new Date(Date.now() - 3590000).toISOString(),
      },
    ],
    artifacts: [
      {
        id: 'art-seed-1',
        conversationId: 'conv-seed-1',
        messageId: 'msg-seed-2',
        identifier: 'interactive-counter-app',
        title: 'Interactive Analytics Counter',
        type: 'react',
        language: 'tsx',
        content: `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(10);
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md text-center font-sans">
      <h2 className="text-xl font-bold text-gray-800">Seed Metric Counter</h2>
      <div className="my-6 text-4xl font-extrabold text-teal-600">{count}</div>
      <div className="flex gap-2 justify-center">
        <button onClick={() => setCount(c => Math.max(0, c - 1))} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200">-</button>
        <button onClick={() => setCount(c => c + 1)} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700">+</button>
      </div>
    </div>
  );
}`,
        version: 1,
        createdAt: new Date(Date.now() - 3590000).toISOString(),
      },
    ],
  };
}

export function readStore(): DbSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    const init = getInitialData();
    fs.writeFileSync(STORE_FILE, JSON.stringify(init, null, 2), 'utf-8');
    return init;
  }
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return getInitialData();
  }
}

export function writeStore(data: DbSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  getConversations(): Conversation[] {
    const store = readStore();
    return store.conversations.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getConversation(id: string): Conversation | undefined {
    return readStore().conversations.find((c) => c.id === id);
  },

  saveConversation(conv: Conversation): void {
    const store = readStore();
    const idx = store.conversations.findIndex((c) => c.id === conv.id);
    if (idx >= 0) {
      store.conversations[idx] = conv;
    } else {
      store.conversations.unshift(conv);
    }
    writeStore(store);
  },

  deleteConversation(id: string): void {
    const store = readStore();
    store.conversations = store.conversations.filter((c) => c.id !== id);
    store.messages = store.messages.filter((m) => m.conversationId !== id);
    store.artifacts = store.artifacts.filter((a) => a.conversationId !== id);
    writeStore(store);
  },

  getMessages(conversationId: string): ChatMessage[] {
    const store = readStore();
    const msgs = store.messages.filter((m) => m.conversationId === conversationId);
    return msgs.map((m) => {
      const relatedArtifacts = store.artifacts.filter((a) => a.messageId === m.id);
      return {
        ...m,
        artifacts: relatedArtifacts.length > 0 ? relatedArtifacts : undefined,
      };
    });
  },

  saveMessage(msg: ChatMessage & { conversationId: string; parentId?: string }): void {
    const store = readStore();
    const idx = store.messages.findIndex((m) => m.id === msg.id);
    if (idx >= 0) {
      store.messages[idx] = msg;
    } else {
      store.messages.push(msg);
    }
    writeStore(store);
  },

  saveArtifact(art: Artifact & { conversationId: string; messageId: string }): void {
    const store = readStore();
    const idx = store.artifacts.findIndex(
      (a) => a.conversationId === art.conversationId && a.identifier === art.identifier && a.version === art.version
    );
    if (idx >= 0) {
      store.artifacts[idx] = art;
    } else {
      store.artifacts.push(art);
    }
    writeStore(store);
  },

  getArtifact(id: string): Artifact | undefined {
    return readStore().artifacts.find((a) => a.id === id);
  },

  getProjects(): Project[] {
    return readStore().projects;
  },

  saveProject(project: Project): void {
    const store = readStore();
    const idx = store.projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      store.projects[idx] = project;
    } else {
      store.projects.push(project);
    }
    writeStore(store);
  },
};
