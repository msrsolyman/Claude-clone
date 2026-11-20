# Atelier — AI Workspace & Interactive Artifact Studio

An open-source, desktop-ready AI workspace engineered for live code generation, interactive React artifacts execution, and hybrid reasoning. Built with **Next.js 15 App Router**, **Tailwind CSS**, and **Electron**, with out-of-the-box support for both cloud models and **Local PC Models (Ollama)**.

![Atelier Preview](electron/icon.png)

---

## ✨ Features

- **⚡ Live Interactive Artifacts:** Sandboxed execution engine supporting React 18, Babel Standalone, and Tailwind CSS. Toggle between live preview and source code with one-click copy.
- **🧠 Thinking Accordion:** Collapsible chain-of-thought `<thinking>` blocks with step timers and token streams.
- **🖥️ Local PC AI (Ollama Integration):** Auto-detects local models running on your machine (e.g. Qwen 2.5, Qwen 3.5, Llama 3, Mistral, DeepSeek) via `http://127.0.0.1:11434`. Zero cloud API key required for full offline usage.
- **🪟 Native Desktop Application:** Packaged with an Electron desktop wrapper featuring a custom application icon, clean window chrome, and auto-spawning background server.
- **🚀 One-Click Desktop Installer:** Built-in PowerShell and batch scripts to generate desktop shortcuts (`Atelier.lnk`) and Windows Start Menu entries.
- **🎨 Nordic Minimalist Design System:** 100% WCAG AA compliant palette (Nordic Teal & Slate) with smooth responsive layouts.

---

## 🛠️ System Requirements

- **Node.js:** v18.18 or higher (v20+ recommended)
- **Package Manager:** `pnpm` (or `npm`)
- **Local AI (Optional):** [Ollama](https://ollama.ai) installed with any model (e.g. `ollama run qwen2.5:0.5b` or `ollama run llama3.2`)

---

## 📦 Quick Start (Any PC)

### 1. Clone Repository
```bash
git clone https://github.com/msrsolyman/Claude-clone.git
cd Claude-clone
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Build & Run in Web Browser
```bash
# Build production bundle
pnpm build

# Start local server on port 3000
pnpm start
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Running as Native Desktop App (Windows)

### Option A: Direct Command
```bash
pnpm desktop
```

### Option B: Silent Launcher
Double-click `Atelier.vbs` or `Atelier.bat` in the project root folder.

### Option C: Install Desktop & Start Menu Shortcut
Run the installer script:
- Right-click `scripts/install-desktop.bat` and select **Run**, or
- In PowerShell:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/install-desktop.ps1
  ```
This creates:
- **Desktop Shortcut:** `Atelier.lnk` directly on your Windows Desktop.
- **Start Menu Entry:** Searchable via Windows Start Menu as **Atelier**.

---

## 🤖 Using Local PC Models (Ollama)

1. Make sure Ollama is installed and running (`ollama serve`).
2. Pull any model of your choice:
   ```bash
   ollama pull qwen2.5:0.5b
   # or
   ollama pull llama3.2
   ```
3. Open Atelier — the model will automatically appear in the model selector dropdown under **"Local PC Models (Ollama)"** with a live status indicator!

---

## 📁 Project Architecture

```
Claude-clone/
├── electron/              # Desktop app wrapper & assets
│   ├── main.js            # Electron lifecycle & server auto-spawner
│   ├── icon.png           # App icon (PNG)
│   └── icon.ico           # Windows application icon (ICO)
├── scripts/
│   ├── install-desktop.ps1 # Windows Desktop & Start Menu installer
│   ├── install-desktop.bat # One-click batch installer
│   ├── migrate.js         # Schema migration script
│   └── seed.js            # Seed test conversations & artifacts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/      # Real-time SSE chat streaming (Ollama + Cloud)
│   │   │   ├── models/    # Dynamic model discovery & Ollama health check
│   │   │   └── ...
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/        # UI components (PromptBox, ArtifactDrawer, etc.)
│   └── lib/               # Database store and artifact parsers
├── Atelier.bat            # Desktop launcher script
├── Atelier.vbs            # Silent windowless launcher
├── package.json
└── README.md
```

---

## 📄 License

MIT License. Free for personal, commercial, and research use.
