import { useState, useRef } from 'react';
import styles from './App.module.css';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const EXAMPLES = [
  'a frog who trades derivatives on-chain',
  'a dog that accidentally runs for president',
  'an AI that ate the entire internet',
  'a sleepy panda who becomes a billionaire',
  'a cat obsessed with laser pointers and DeFi',
];

function viralLabel(score) {
  if (score >= 88) return { label: 'Legendary 🔥', color: 'var(--accent-text)' };
  if (score >= 75) return { label: 'Viral', color: 'var(--success-text)' };
  if (score >= 55) return { label: 'Strong', color: 'var(--info-text)' };
  return { label: 'Building', color: 'var(--text-secondary)' };
}

async function callClaude(concept) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY || '';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are MemeForge AI — the world's best meme coin concept generator. 
You create complete, launch-ready meme coin packages for BNB Chain / Four.meme.
Respond ONLY with a single valid JSON object. No markdown fences. No extra text. No comments.
Schema:
{
  "tokenName": "string",
  "ticker": "3–5 UPPERCASE letters, no $",
  "tagline": "catchy punchy one-liner",
  "viralityScore": number 0–100,
  "lore": "2–3 sentence fun backstory of the token",
  "tokenomics": {
    "supply": "human-readable e.g. 1,000,000,000",
    "distribution": [
      { "label": "Community & Airdrop", "percent": 40 },
      { "label": "Liquidity Pool",      "percent": 30 },
      { "label": "Team & Dev",          "percent": 15 },
      { "label": "Marketing & KOLs",    "percent": 15 }
    ]
  },
  "tweetThread": ["tweet 1 text with hashtags", "tweet 2 text", "tweet 3 text"],
  "communityStrategy": "2-sentence community-building plan",
  "targetAudience": "who will ape into this coin"
}`,
      messages: [
        {
          role: 'user',
          content: `Generate a meme coin launch package for this concept: "${concept}"`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const raw = (data.content || []).map((b) => b.text || '').join('');
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function ViralityBar({ score }) {
  const { label, color } = viralLabel(score);
  return (
    <div className={styles.viralRow}>
      <span className={styles.viralNum}>{score}</span>
      <div className={styles.viralTrack}>
        <div
          className={styles.viralFill}
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className={styles.viralLabel} style={{ color }}>{label}</span>
    </div>
  );
}

function DistBar({ label, percent }) {
  return (
    <div className={styles.distRow}>
      <div className={styles.distHead}>
        <span className={styles.distKey}>{label}</span>
        <span className={styles.distPct}>{percent}%</span>
      </div>
      <div className={styles.distTrack}>
        <div className={styles.distFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function TweetCard({ index, text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div className={styles.tweetCard}>
      <span className={styles.tweetIdx}>{index + 1}/</span>
      <p className={styles.tweetText}>{text}</p>
      <button className={styles.copyBtn} onClick={copy}>
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );
}

function Card({ label, children, accent }) {
  return (
    <div className={styles.card} style={accent ? { borderColor: accent, borderWidth: '1px' } : {}}>
      {label && <div className={styles.cardLabel}>{label}</div>}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main App
───────────────────────────────────────── */
export default function App() {
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const textareaRef = useRef(null);

  const handleForge = async () => {
    const trimmed = concept.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await callClaude(trimmed);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Something went wrong. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleForge();
  };

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.logo}>🔥</div>
        <div>
          <h1 className={styles.brand}>MemeForge AI</h1>
          <p className={styles.brandSub}>
            AI-powered meme coin launch kit &mdash; concept to BNB Chain in seconds
          </p>
        </div>
        <a
          href="https://four.meme"
          target="_blank"
          rel="noreferrer"
          className={styles.fourdotBtn}
        >
          four.meme ↗
        </a>
      </header>

      {/* ── Input Area ── */}
      <div className={styles.inputCard}>
        <p className={styles.inputLabel}>Describe your meme concept</p>

        <div className={styles.chips}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              className={styles.chip}
              onClick={() => {
                setConcept(ex);
                textareaRef.current?.focus();
              }}
            >
              {ex}
            </button>
          ))}
        </div>

        <div className={styles.inputRow}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            rows={2}
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. a sleepy panda who accidentally becomes a billionaire..."
          />
          <button
            className={styles.forgeBtn}
            onClick={handleForge}
            disabled={loading || !concept.trim()}
          >
            {loading ? '...' : '⚡ Forge'}
          </button>
        </div>

        <p className={styles.hint}>Ctrl / ⌘ + Enter to generate</p>
      </div>

      {/* ── API Key Notice ── */}
      {!process.env.REACT_APP_ANTHROPIC_API_KEY && !result && !loading && (
        <div className={styles.notice}>
          <strong>Setup:</strong> Add{' '}
          <code>REACT_APP_ANTHROPIC_API_KEY=your_key</code> to a{' '}
          <code>.env</code> file in the project root, then restart the dev server.
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className={styles.loading}>
          <Spinner />
          <div>
            <p className={styles.loadingTitle}>Analyzing meme potential...</p>
            <p className={styles.loadingSubtitle}>
              Generating token DNA, lore, tokenomics &amp; launch assets
            </p>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && <div className={styles.error}>{error}</div>}

      {/* ── Results ── */}
      {result && <Results data={result} />}
    </div>
  );
}

/* ─────────────────────────────────────────
   Results Panel
───────────────────────────────────────── */
function Results({ data }) {
  const {
    tokenName, ticker, tagline, viralityScore,
    lore, tokenomics, tweetThread,
    communityStrategy, targetAudience,
  } = data;

  return (
    <div className={styles.results}>

      {/* Identity */}
      <Card label="Token identity" accent="var(--accent-border)">
        <div className={styles.heroRow}>
          <span className={styles.heroName}>{tokenName}</span>
          <span className={styles.heroTicker}>${ticker}</span>
        </div>
        {tagline && <p className={styles.heroTagline}>"{tagline}"</p>}
      </Card>

      {/* 2-col row */}
      <div className={styles.twoCol}>
        <Card label="Virality score">
          <ViralityBar score={Math.round(viralityScore || 0)} />
        </Card>
        <Card label="Target audience">
          <p className={styles.bodyText}>{targetAudience}</p>
        </Card>
      </div>

      {/* Lore */}
      <Card label="Origin lore">
        <p className={styles.loreText}>{lore}</p>
      </Card>

      {/* Tokenomics */}
      <Card label="Tokenomics">
        <p className={styles.supplyText}>
          Total supply: <strong>{tokenomics?.supply}</strong>
        </p>
        <div className={styles.distDivider} />
        {(tokenomics?.distribution || []).map((d) => (
          <DistBar key={d.label} label={d.label} percent={Math.round(d.percent)} />
        ))}
      </Card>

      {/* Tweet thread */}
      <Card label="Viral launch thread — copy & post">
        {(tweetThread || []).map((t, i) => (
          <TweetCard key={i} index={i} text={t} />
        ))}
      </Card>

      {/* Community */}
      <Card label="Community strategy">
        <p className={styles.bodyText}>{communityStrategy}</p>
      </Card>

      {/* Launch CTA */}
      <div className={styles.launchCta}>
        <div>
          <p className={styles.ctaTitle}>Ready to launch on Four.meme</p>
          <p className={styles.ctaSub}>
            BNB Chain &bull; No token issuance required &bull; Go live in minutes
          </p>
        </div>
        <a
          href="https://four.meme"
          target="_blank"
          rel="noreferrer"
          className={styles.launchBtn}
        >
          Launch now ↗
        </a>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────
   Spinner
───────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      className={styles.spinner}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="9" stroke="var(--border-mid)" strokeWidth="2.5" />
      <path
        d="M11 2a9 9 0 0 1 9 9"
        stroke="var(--accent-text)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
