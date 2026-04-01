# 🔥 MemeForge AI

> AI-powered meme coin launch kit — from concept to BNB Chain in seconds.
> Built for the **Four.meme AI Sprint Hackathon 2026**.

---

## What it does

Paste any meme idea and MemeForge AI instantly generates:

- **Token name + ticker** tailored to the concept
- **Virality score** (0–100) with a human-readable label
- **Origin lore** — the token's backstory
- **Tokenomics** — supply + visual distribution breakdown
- **3-tweet launch thread** — copy-paste ready
- **Community strategy** + target audience profile
- **Direct CTA** to launch on [four.meme](https://four.meme)

---

## Quick start

### 1. Clone / download and install

```bash
cd memeforge-ai
npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.example .env
```

Open `.env` and replace `your_anthropic_api_key_here` with your real key.
Get one at [console.anthropic.com](https://console.anthropic.com).

```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Start the dev server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
memeforge-ai/
├── public/
│   └── index.html
├── src/
│   ├── index.js          # React entry point
│   ├── index.css         # Global reset + design tokens
│   ├── App.jsx           # Main app + all components
│   └── App.module.css    # Scoped component styles
├── .env.example          # Copy → .env and add API key
├── package.json
└── README.md
```

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, CSS Modules |
| AI | Anthropic Claude (claude-sonnet-4) |
| Fonts | Syne (display), IBM Plex Mono |
| Deploy target | four.meme / BNB Chain |

---

## Build for production

```bash
npm run build
```

Output in `build/` — ready to deploy to Vercel, Netlify, or any static host.

---

## Hackathon

**Four.meme AI Sprint 2026** — $50,000 prize pool  
Build phase: April 8–21, 2026  
Submission deadline: April 22, 2026
