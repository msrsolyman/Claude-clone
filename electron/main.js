const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const http = require('http');
const { spawn, exec } = require('child_process');

let mainWindow = null;
let nextProcess = null;
let ollamaProcess = null;

const PORT = 3000;
const SERVER_URL = `http://127.0.0.1:${PORT}`;
const OLLAMA_URL = 'http://127.0.0.1:11434/api/tags';

// Check if a URL responds with 200 OK
function checkService(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const req = http.request(
        {
          host: parsed.hostname,
          port: parsed.port,
          path: parsed.pathname,
          method: 'GET',
          timeout: 1500,
        },
        (res) => {
          resolve(res.statusCode >= 200 && res.statusCode < 400);
        }
      );
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

// Wait for a service to become available
async function waitForService(url, maxAttempts = 30, intervalMs = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    const isUp = await checkService(url);
    if (isUp) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}

// Ensure Ollama daemon is running in background
async function ensureOllama() {
  const isRunning = await checkService(OLLAMA_URL);
  if (isRunning) {
    console.log('[Atelier Desktop] Ollama is already active.');
    return;
  }

  const defaultOllamaPath = path.join(
    process.env.LOCALAPPDATA || 'C:\\Users\\msr88\\AppData\\Local',
    'Programs',
    'Ollama',
    'ollama.exe'
  );

  console.log('[Atelier Desktop] Launching Ollama daemon...');
  try {
    ollamaProcess = spawn(defaultOllamaPath, ['serve'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });
    ollamaProcess.unref();
  } catch (err) {
    console.warn('[Atelier Desktop] Could not auto-launch Ollama:', err.message);
  }
}

// Ensure Next.js production server is running
async function ensureNextServer() {
  const isRunning = await checkService(SERVER_URL);
  if (isRunning) {
    console.log('[Atelier Desktop] Atelier server is already running.');
    return;
  }

  console.log('[Atelier Desktop] Starting production Next.js server on port 3000...');
  const appRoot = path.resolve(__dirname, '..');

  const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

  nextProcess = spawn(pnpmCmd, ['start', '-p', String(PORT)], {
    cwd: appRoot,
    stdio: 'ignore',
    detached: false,
    windowsHide: true,
    shell: true,
  });

  const isReady = await waitForService(SERVER_URL, 25, 1000);
  if (!isReady) {
    throw new Error('Atelier server failed to initialize within the expected timeframe.');
  }
  console.log('[Atelier Desktop] Atelier server is ready!');
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 960,
    minHeight: 620,
    title: 'Atelier',
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    backgroundColor: '#FAF9F5',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Display initial loading indicator while server is booting
  const loadingHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Atelier</title>
        <style>
          body {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #FAF9F5;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1e293b;
          }
          .card {
            text-align: center;
          }
          .spinner {
            width: 44px;
            height: 44px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #0f766e;
            border-radius: 50%;
            animation: spin 0.9s linear infinite;
            margin: 0 auto 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 600; }
          p { margin: 0; font-size: 13px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h2>Initializing Atelier</h2>
          <p>Connecting local AI models & workspace...</p>
        </div>
      </body>
    </html>
  `;

  mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(loadingHtml));

  try {
    await Promise.all([ensureOllama(), ensureNextServer()]);
    mainWindow.loadURL(SERVER_URL);
  } catch (err) {
    dialog.showErrorBox('Atelier Startup Error', err.message);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (nextProcess) {
    try {
      if (process.platform === 'win32') {
        exec(`taskkill /pid ${nextProcess.pid} /T /F`);
      } else {
        nextProcess.kill();
      }
    } catch {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
