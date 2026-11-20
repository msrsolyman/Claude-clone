import { test, describe } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

describe('Atelier QA & E2E Test Suite', () => {
  // Test Home page renders
  test('S02-H1: Home page loads with status 200 and Atelier title', async () => {
    const res = await fetch(BASE_URL);
    assert.strictEqual(res.status, 200, 'Home page must return 200 OK');
    const html = await res.text();
    assert.ok(html.includes('Atelier'), 'HTML must include Atelier brand title');
  });

  // Flow F01: Ask prompt & Stream response
  test('F01-H1: POST /api/chat streams completion with thinking and content', async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: 'test-conv-f01',
        messages: [{ role: 'user', content: 'Explain quantum computing in simple terms' }],
        model: 'sonnet-3.7',
      }),
    });

    assert.strictEqual(res.status, 200, 'Streaming API must return 200 OK');
    assert.ok(res.headers.get('content-type')?.includes('text/plain'), 'Content-type must be plain text stream');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value);
    }

    assert.ok(accumulated.includes('<thinking>'), 'Stream must contain <thinking> reasoning phase');
    assert.ok(accumulated.includes('</thinking>'), 'Stream must close </thinking> phase');
    assert.ok(accumulated.length > 50, 'Stream must return non-trivial content');
  });

  // Flow F02: Generate & Inspect Artifact
  test('F02-H1: POST /api/chat extracts antArtifact with React code', async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: 'test-conv-f02',
        messages: [{ role: 'user', content: 'Build an interactive React counter component' }],
        model: 'sonnet-3.7',
      }),
    });

    assert.strictEqual(res.status, 200);
    const text = await res.text();

    assert.ok(text.includes('<antArtifact'), 'Stream must trigger <antArtifact> tag for component request');
    assert.ok(text.includes('type="application/vnd.ant.react"'), 'Artifact type must be react');
    assert.ok(text.includes('export default function App'), 'Artifact must contain executable React App code');
  });

  // Flow F03: Projects & Persistence
  test('F03-H1: GET /api/projects lists projects', async () => {
    const res = await fetch(`${BASE_URL}/api/projects`);
    assert.strictEqual(res.status, 200);
    const projects = await res.json();
    assert.ok(Array.isArray(projects), 'Projects must be an array');
    assert.ok(projects.length >= 1, 'Should have at least 1 default/seeded project');
  });

  test('F03-H2: POST /api/projects creates a new project container', async () => {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Automation Workflow Test',
        description: 'Testing project persistence',
        customInstructions: 'Output concise responses',
      }),
    });

    assert.strictEqual(res.status, 200);
    const project = await res.json();
    assert.strictEqual(project.title, 'Automation Workflow Test');
    assert.ok(project.id.startsWith('proj-'));
  });

  // Flow F04: Conversations CRUD & Message Branches
  test('F04-H1: GET /api/conversations lists conversations in reverse chronological order', async () => {
    const res = await fetch(`${BASE_URL}/api/conversations`);
    assert.strictEqual(res.status, 200);
    const list = await res.json();
    assert.ok(Array.isArray(list), 'Conversations must be an array');
    assert.ok(list.length > 0, 'Must contain conversations');
  });

  test('F04-H2: GET /api/conversations/:id loads messages and artifacts', async () => {
    const res = await fetch(`${BASE_URL}/api/conversations/conv-seed-1`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.conversation, 'Response must include conversation');
    assert.ok(Array.isArray(data.messages), 'Response must include messages array');
    assert.ok(data.messages.length >= 2, 'Seed conversation must have messages');
  });

  test('F04-N1: GET /api/conversations/conv-not-found returns 404', async () => {
    const res = await fetch(`${BASE_URL}/api/conversations/conv-not-found-9999`);
    assert.strictEqual(res.status, 404, 'Non-existent conversation must return 404');
  });

  // Edge cases
  test('F01-E1: Very long prompt handling', async () => {
    const longPrompt = 'A'.repeat(5000);
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: 'test-conv-long',
        messages: [{ role: 'user', content: longPrompt }],
        model: 'sonnet-3.7',
      }),
    });
    assert.strictEqual(res.status, 200, 'Server must handle long inputs without crashing');
  });
});
