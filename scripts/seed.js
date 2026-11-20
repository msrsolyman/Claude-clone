// Database Seeding Script
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const storeFile = path.join(dataDir, 'store.json');

const seedData = {
  users: [
    {
      id: 'usr-default',
      email: 'alex@example.com',
      name: 'Alex Developer',
      apiProvider: 'default-provider',
      theme: 'warm-dark',
      createdAt: new Date().toISOString(),
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Web Component Lab',
      description: 'Experiments with interactive UI elements and micro-apps',
      customInstructions: 'Focus on accessible, beautiful React components with Tailwind CSS.',
      documentsCount: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  conversations: [
    {
      id: 'conv-seed-1',
      title: 'Interactive Metric Pulse',
      model: 'sonnet-3.7',
      isPinned: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  messages: [
    {
      id: 'msg-seed-1',
      conversationId: 'conv-seed-1',
      role: 'user',
      content: 'Create an interactive metric pulse counter component in React',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'msg-seed-2',
      conversationId: 'conv-seed-1',
      role: 'assistant',
      content: `I've created an interactive metric counter component for you.\n\n> 📦 **Artifact Created:** [Interactive Analytics Counter](#artifact-interactive-counter-app)\n\nYou can click the card above to inspect the live preview.`,
      thinking: '1. User asked for a counter\n2. Creating reactive state with history\n3. Applying clean Tailwind layout',
      createdAt: new Date(Date.now() - 7190000).toISOString(),
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
      <h2 className="text-xl font-bold text-gray-800">Pulse Metric</h2>
      <div className="my-6 text-4xl font-extrabold text-teal-600">{count}</div>
      <div className="flex gap-2 justify-center">
        <button onClick={() => setCount(c => Math.max(0, c - 1))} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200">- Decrement</button>
        <button onClick={() => setCount(c => c + 1)} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700">+ Increment</button>
      </div>
    </div>
  );
}`,
      version: 1,
      createdAt: new Date(Date.now() - 7190000).toISOString(),
    },
  ],
};

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(storeFile, JSON.stringify(seedData, null, 2), 'utf-8');
console.log('✅ Seed data successfully written to store.json');
