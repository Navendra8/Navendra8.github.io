import React, { useEffect, useRef, useState, useCallback } from 'react';

// ------------------------------------------------------------
// Small helpers
// ------------------------------------------------------------
const Prompt = ({ cwd = '~' }) => (
  <span>
    <span className="text-accent">navendra@portfolio</span>
    <span className="text-muted">:</span>
    <span className="text-link">{cwd}</span>
    <span className="text-muted">$</span>{' '}
  </span>
);

const H = ({ children }) => (
  <div className="text-accent">
    {`╘══ ${children} ${'═'.repeat(Math.max(0, 56 - String(children).length))}╛`}
  </div>
);

const Row = ({ left, right }) => (
  <div className="grid grid-cols-[170px_1fr] gap-3">
    <span className="text-muted">{left}</span>
    <span>{right}</span>
  </div>
);

// ------------------------------------------------------------
// Content (from CV)
// ------------------------------------------------------------
const BIO = [
  "Navendra Singh — AI Engineer · Newcastle, UK.",
  "Shipping production LLM systems on enterprise data inside a 400-person",
  "regulated manufacturer (aerospace, defence, medical).",
  "Builder of DataPilot — text-to-SQL with a self-correcting Expert/Tester loop.",
];

const EXPERIENCE = [
  { dates: 'Sep 2023 — Now',      role: 'Data Engineer & AI Builder', co: 'Harwin, UK' },
  { dates: 'Oct 2022 — Apr 2023', role: 'Data Insight Manager',        co: 'Brittany Ferries, UK' },
  { dates: 'Oct 2021 — Oct 2022', role: 'Data Insight Manager',        co: 'ICS-Digital, Leeds, UK' },
  { dates: 'Jan 2020 — Oct 2021', role: 'Data Analyst',                co: 'GIP Technologies, Jaipur, India' },
  { dates: 'Mar 2017 — Aug 2019', role: 'Data Analyst',                co: 'GK Telecom, Edinburgh, UK' },
];

const WORK = [
  { k: 'datapilot',  t: 'DataPilot — text-to-SQL w/ Expert/Tester loop', meta: 'flagship · 150+ users · ~90% accuracy · <5s' },
  { k: 'ai-insider', t: 'Harwin AI Insider — internal LLM enablement',    meta: '24 weeks · 400 staff · github pages', href: 'https://harwin-1.github.io/harwin-ai-insider/' },
  { k: 'mcp-server', t: 'MCP Server for Claude Desktop',                   meta: 'Anthropic MCP · MySQL warehouse · tool use' },
  { k: 'platform',   t: 'Data Platform Rebuild',                           meta: 'AWS + Snowflake · n8n · POS full-day → <5min' },
];

const STACK = {
  'AI & LLM':         ['Claude API','OpenAI API','Anthropic MCP','Expert/Tester loops','Prompt engineering','Structured outputs','Tool use','RAG','LLM eval','Guardrails','Token/cost','Query telemetry'],
  'Automation & Data':['n8n','Python','AWS Data Lake','Snowflake','ETL/ELT','Data modelling','EDI','Validation frameworks'],
  'Analytics & BI':   ['SQL','Tableau','Power BI','QuickSight','Streamlit','KPI dashboards','GTM analytics'],
  'ML & Advanced':    ['Predictive modelling','Forecasting','Segmentation (k-means)','NLP/sentiment','Statistical analysis'],
  'Databases':        ['Snowflake','MySQL','MS SQL Server','Oracle IFS','MS Access'],
  'Integration':      ['Selenium','BeautifulSoup','Scrapy','REST APIs'],
};

const ARCH = `
    ┌───────────────────┐
    │   User prompt     │  "Top 10 customers by revenue this quarter"
    └─────────┬─────────┘
              ▼
    ┌───────────────────┐        ┌──────────────────┐
    │   Expert agent    │◀──────▶│  Schema cache    │  (versioned snapshots)
    │  (SQL generator)  │        └──────────────────┘
    └─────────┬─────────┘
              ▼ draft SQL
    ┌───────────────────┐        ┌──────────────────┐
    │   Tester agent    │◀──────▶│  Read replica    │  (sandboxed exec)
    │ (validate + retry)│        └──────────────────┘
    └─────────┬─────────┘
              │ loop on invalid / shape mismatch
              ▼
    ┌───────────────────┐
    │    Guardrails     │  read-only · row limits · timeouts · graceful degradation
    └─────────┬─────────┘
              ▼
    ┌───────────────────┐
    │      Output       │  validated SQL + results  (p50 < 5s · ~90% first-pass)
    └───────────────────┘
`;

const COMMANDS = [
  'help','whoami','about','work','datapilot','experience','stack','skills',
  'education','certifications','contact','resume','ls','pwd','cat','echo',
  'clear','source','date','banner',
];

const ALIASES = { skills: 'stack', cert: 'certifications', certs: 'certifications', exp: 'experience', me: 'whoami', bio: 'whoami' };

// ------------------------------------------------------------
// Command dispatch
// ------------------------------------------------------------
function runCommand(raw, { clear }) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const [cmdRawRaw, ...args] = trimmed.split(/\s+/);
  const cmdRaw = cmdRawRaw.toLowerCase();
  const cmd = ALIASES[cmdRaw] || cmdRaw;

  switch (cmd) {
    case 'help':           return renderHelp();
    case 'whoami':         return renderWhoami();
    case 'about':          return renderAbout();
    case 'work':           return renderWork(args);
    case 'datapilot':      return renderDataPilot(args);
    case 'experience':     return renderExperience();
    case 'stack':          return renderStack(args);
    case 'education':      return renderEducation();
    case 'certifications': return renderCertifications();
    case 'contact':        return renderContact();
    case 'resume':         return renderResume();
    case 'ls':             return renderLs();
    case 'pwd':            return <div>/home/navendra/portfolio</div>;
    case 'date':           return <div className="text-muted">{new Date().toString()}</div>;
    case 'banner':         return renderBanner();
    case 'echo':           return <div>{args.join(' ')}</div>;
    case 'cat':            return renderCat(args);
    case 'source':         return renderSource();
    case 'clear':          clear(); return null;

    case 'sudo': return <div className="text-warn">nice try. try `help` instead.</div>;
    case 'rm':   return <div className="text-err">rm: permission denied — this is a portfolio, not a playground.</div>;
    case 'exit': return <div className="text-muted">there is no exit. close the tab like the rest of us.</div>;
    case 'ai':   return <div>i <span className="text-accent">am</span> the AI.</div>;

    default: {
      const suggestion = didYouMean(cmdRaw);
      return (
        <div>
          <span className="text-err">command not found:</span> {cmdRaw}
          {suggestion && <span className="text-muted">  —  did you mean <span className="text-accent">{suggestion}</span>?</span>}
        </div>
      );
    }
  }
}

function didYouMean(input) {
  if (!input) return null;
  let best = null, bestD = 99;
  for (const c of COMMANDS) {
    const d = distance(input, c);
    if (d < bestD) { bestD = d; best = c; }
  }
  return bestD <= 3 ? best : null;
}

function distance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = a[i - 1] === b[j - 1]
      ? dp[i - 1][j - 1]
      : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  }
  return dp[m][n];
}

// ------------------------------------------------------------
// Renderers
// ------------------------------------------------------------
function renderHelp() {
  const rows = [
    ['whoami',            'short bio'],
    ['work',              'list selected projects'],
    ['datapilot [--architecture|--stats|--why]', 'the flagship, in detail'],
    ['experience',        'career timeline'],
    ['stack [--filter]',  'skills by category'],
    ['education',         'qualifications'],
    ['certifications',    'certs + in progress'],
    ['contact',           'how to reach me'],
    ['resume',            'download the CV'],
    ['ls / pwd / date',   'shell basics'],
    ['clear',             'clear the screen'],
  ];
  return (
    <div>
      <H>COMMANDS</H>
      <div className="mt-2 grid gap-y-0.5">
        {rows.map(([c, d]) => (
          <div key={c} className="grid grid-cols-[260px_1fr] gap-3">
            <span className="text-accent">{c}</span>
            <span className="text-muted">{d}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-muted">
        Tab-completes. ↑/↓ for history. Ctrl+L clears.
      </div>
    </div>
  );
}

function renderWhoami() {
  return (
    <div>
      {BIO.map((l, i) => <div key={i}>{l}</div>)}
      <div className="mt-2 text-muted">hint: try <span className="text-accent">datapilot --architecture</span></div>
    </div>
  );
}

function renderAbout() {
  return (
    <div>
      <H>ABOUT</H>
      <div className="mt-2 space-y-2">
        <div>Eight-plus years across Python, SQL, and cloud data engineering.</div>
        <div>Deep working knowledge of Anthropic MCP, multi-agent design, and LLM evaluation.</div>
        <div>Open to hybrid London or fully remote AI Engineer roles.</div>
      </div>
    </div>
  );
}

function renderWork(args) {
  if (args[0]) {
    const proj = WORK.find(w => w.k === args[0]);
    if (!proj) return <div className="text-err">no such project: {args[0]}</div>;
    if (proj.k === 'datapilot') return renderDataPilot([]);
    return (
      <div>
        <H>{proj.k.toUpperCase()}</H>
        <div className="mt-2">{proj.t}</div>
        <div className="text-muted">{proj.meta}</div>
        {proj.href && <div className="mt-2"><a className="link" href={proj.href} target="_blank" rel="noreferrer">{proj.href}</a></div>}
      </div>
    );
  }
  return (
    <div>
      <H>WORK</H>
      <div className="mt-2 space-y-1">
        {WORK.map(w => (
          <div key={w.k} className="grid grid-cols-[160px_1fr] gap-3">
            <span className="text-accent">{w.k}</span>
            <span>
              {w.t}
              <div className="text-muted text-sm">
                {w.meta}
                {w.href && <> · <a className="link" href={w.href} target="_blank" rel="noreferrer">open</a></>}
              </div>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-muted">`work datapilot` for the deep dive.</div>
    </div>
  );
}

function renderDataPilot(args) {
  const flag = (args[0] || '').replace(/^-+/, '');

  if (flag === 'architecture' || flag === 'arch') {
    return (
      <div>
        <H>DATAPILOT — ARCHITECTURE</H>
        <pre className="mt-3 text-accent">{ARCH}</pre>
      </div>
    );
  }

  if (flag === 'stats') {
    return (
      <div>
        <H>DATAPILOT — STATS</H>
        <div className="mt-2 grid gap-y-0.5">
          <Row left="users"         right="150+ in Sales, Ops, Finance (half of a 400-person business)" />
          <Row left="accuracy (p1)" right="~90% first-pass, via the Tester loop" />
          <Row left="latency (p50)" right="< 5 seconds" />
          <Row left="deployed"      right="2024, in production since" />
          <Row left="databases"     right="Oracle IFS + Microsoft SQL Server" />
        </div>
      </div>
    );
  }

  if (flag === 'why') {
    return (
      <div>
        <H>DATAPILOT — WHY EXPERT/TESTER</H>
        <pre className="mt-2 text-muted">{
`    single-shot         expert/tester         full ReAct
     ┌──┐                 ┌──┐  ┌──┐          ┌──┐  ┌──┐  ┌──┐
     │SQL│───▶ run        │SQL│─▶│chk│──▶ run │thk│─▶│SQL│─▶│chk│─▶ run
     └──┘                 └──┘  └──┘          └──┘  └──┘  └──┘
   fails quietly on     closes the accuracy  burns tokens on
   schema edge cases      gap, cheaply        reasoning that is
                                              better expressed
                                              as a deterministic
                                              validation step`}</pre>
        <div className="mt-3">
          Expert / Tester over single-shot <span className="text-muted">and</span> over a full ReAct loop.
          Single-shot fails quietly on schema edge cases. ReAct burns tokens on reasoning that is
          better expressed as a deterministic validation step. The Tester loop closes the accuracy gap
          where it matters — valid SQL against a real schema — without paying ReAct&rsquo;s latency and cost.
        </div>
      </div>
    );
  }

  return (
    <div>
      <H>DATAPILOT</H>
      <div className="mt-2">
        Text-to-SQL agent with a self-correcting Expert / Tester loop, serving 150+ non-technical
        users across Sales, Ops, and Finance against live Oracle IFS and SQL Server. Maintains ~90%
        first-pass accuracy with median latency under 5 seconds.
      </div>
      <div className="mt-3 text-muted">
        &nbsp; —&nbsp;&nbsp;<span className="text-accent">datapilot --architecture</span> &nbsp; diagram
      </div>
      <div className="text-muted">
        &nbsp; —&nbsp;&nbsp;<span className="text-accent">datapilot --why</span>          &nbsp;&nbsp; design rationale
      </div>
      <div className="text-muted">
        &nbsp; —&nbsp;&nbsp;<span className="text-accent">datapilot --stats</span>        &nbsp; production numbers
      </div>
      <div className="mt-3">
        <span className="text-muted">stack:</span>{' '}
        {['Python','Streamlit','Claude API','GPT API','Oracle IFS','SQL Server','Query telemetry']
          .map(s => <span key={s} className="chip">{s}</span>)}
      </div>
    </div>
  );
}

function renderExperience() {
  return (
    <div>
      <H>EXPERIENCE</H>
      <div className="mt-2 grid gap-y-1">
        {EXPERIENCE.map((r, i) => (
          <div key={i} className="grid grid-cols-[180px_1fr] gap-3">
            <span className="text-muted">{r.dates}</span>
            <span>
              <span className="text-accent">{r.role}</span>
              <span className="text-muted"> · {r.co}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-muted">`cat harwin.md` for the current-role detail.</div>
    </div>
  );
}

function renderStack(args) {
  const filterArg = args.find(a => a.startsWith('--'));
  const filter = (filterArg ? filterArg.slice(2) : '').toLowerCase();
  const entries = Object.entries(STACK).filter(([k]) => !filter || k.toLowerCase().includes(filter));
  if (entries.length === 0) return <div className="text-err">no category matches `{filter}`</div>;
  return (
    <div>
      <H>STACK</H>
      <div className="mt-2 grid gap-y-3">
        {entries.map(([label, items]) => (
          <div key={label} className="grid md:grid-cols-[200px_1fr] gap-3">
            <span className="text-accent">{label}</span>
            <span className="text-muted">{items.join(' · ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderEducation() {
  return (
    <div>
      <H>EDUCATION</H>
      <div className="mt-2">
        <div>MSc Information Technology (Business)</div>
        <div className="text-muted">Heriot-Watt University, Edinburgh · 2012 – 2013</div>
      </div>
    </div>
  );
}

function renderCertifications() {
  return (
    <div>
      <H>CERTIFICATIONS</H>
      <ul className="mt-2 space-y-1">
        <li><span className="text-warn">[in progress]</span> AWS Certified Machine Learning Engineer (Associate)</li>
        <li>Google Cloud Generative AI — Vertex AI, Prompt Design, GSP519</li>
        <li>Microsoft Certified: Introduction to Programming Using Python (MTA)</li>
        <li>Python with Data Science — Grras Solution Pvt.</li>
      </ul>
    </div>
  );
}

function renderContact() {
  return (
    <div>
      <H>CONTACT</H>
      <div className="mt-2 grid gap-y-0.5">
        <Row left="email"    right={<a className="link" href="mailto:navendra8@gmail.com">navendra8@gmail.com</a>} />
        <Row left="linkedin" right={<a className="link" href="https://linkedin.com/in/navendra-singh" target="_blank" rel="noreferrer">linkedin.com/in/navendra-singh</a>} />
        <Row left="github"   right={<a className="link" href="https://github.com/Navendra8" target="_blank" rel="noreferrer">github.com/Navendra8</a>} />
        <Row left="based in" right="Newcastle, UK" />
        <Row left="open to"  right="hybrid London or fully remote AI Engineer roles" />
      </div>
    </div>
  );
}

function renderResume() {
  return (
    <div>
      <span className="text-warn">resume:</span> email me at{' '}
      <a className="link" href="mailto:navendra8@gmail.com?subject=CV%20request">navendra8@gmail.com</a>
      {' '}for the latest PDF.
    </div>
  );
}

function renderLs() {
  return (
    <div className="text-accent">
      <span className="mr-4">about.md</span>
      <span className="mr-4">harwin.md</span>
      <span className="mr-4">experience.md</span>
      <span className="mr-4">stack.md</span>
      <span className="mr-4">contact.md</span>
    </div>
  );
}

function renderCat(args) {
  const file = (args[0] || '').toLowerCase();
  if (!file) return <div className="text-err">usage: cat &lt;file&gt;</div>;

  if (file === 'harwin.md') {
    const bullets = [
      <><span className="text-accent">·</span> <span>DataPilot (flagship) — text-to-SQL with Expert/Tester loop</span></>,
      <><span className="text-accent">·</span> <span>MCP server exposing the MySQL warehouse inside Claude Desktop</span></>,
      <><span className="text-accent">·</span> <span>Harwin AI Insider — 24-week LLM enablement for all 400 staff</span></>,
      <><span className="text-accent">·</span> <span>n8n automated analytics — up to 95% turnaround reduction</span></>,
      <><span className="text-accent">·</span> <span>AWS Data Lake + Snowflake consolidating ERP / CRM / distributors</span></>,
      <><span className="text-accent">·</span> <span>Distributor POS rebuild — full-day patchwork → single Python pipeline &lt; 5 min</span></>,
      <><span className="text-accent">·</span> <span>One critical report cut from 24h to 30min</span></>,
      <><span className="text-accent">·</span> <span>Tableau + Streamlit executive dashboards</span></>,
      <><span className="text-accent">·</span> <span>Data integrity, validation, and governance across the analytics function</span></>,
    ];
    return (
      <div>
        <H>HARWIN — DATA ENGINEER & AI BUILDER · SEP 2023 — NOW</H>
        <ul className="mt-2 space-y-1">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
    );
  }
  if (file === 'about.md')      return renderAbout();
  if (file === 'experience.md') return renderExperience();
  if (file === 'stack.md')      return renderStack([]);
  if (file === 'contact.md')    return renderContact();
  return <div className="text-err">cat: {file}: no such file</div>;
}

function renderBanner() {
  const banner =
`
  ███╗   ██╗ █████╗ ██╗   ██╗
  ████╗  ██║██╔══██╗██║   ██║
  ██╔██╗ ██║███████║██║   ██║      Navendra Singh
  ██║╚██╗██║██╔══██║╚██╗ ██╔╝      AI Engineer · Newcastle, UK
  ██║ ╚████║██║  ██║ ╚████╔╝       type \`help\` to begin
  ╚═╝  ╚═══╝╚═╝  ╚═╝  ╚═══╝
`;
  return <pre className="text-accent">{banner}</pre>;
}

function renderSource() {
  return (
    <div>
      <H>SOURCE</H>
      <div className="mt-2">this terminal is ~600 lines of React. the rest of the portfolio is at <a className="link" href="/">/</a>.</div>
      <div className="text-muted">
        source: <a className="link" href="https://github.com/Navendra8/Navendra8.github.io" target="_blank" rel="noreferrer">github.com/Navendra8/Navendra8.github.io</a>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------
export default function TerminalApp() {
  const [history, setHistory]     = useState([]);
  const [input, setInput]         = useState('');
  const [cmdHistory, setCmdHist]  = useState([]);
  const [histPtr, setHistPtr]     = useState(-1);
  const [intro, setIntro]         = useState('');
  const [introDone, setIntroDone] = useState(false);
  const inputRef  = useRef(null);
  const scrollRef = useRef(null);

  // Intro auto-runs `whoami`, character by character
  useEffect(() => {
    const text = BIO.join('\n');
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setIntro(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setTimeout(() => setIntroDone(true), 250);
      }
    }, 18);
    return () => clearInterval(iv);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [history, introDone]);

  // Keep input focused
  useEffect(() => {
    if (!introDone) return;
    const focus = () => inputRef.current?.focus();
    focus();
    const onClick = (e) => {
      // don't steal focus from links or mobile buttons
      const t = e.target;
      if (t.closest('a') || t.closest('button')) return;
      focus();
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [introDone]);

  const clear = useCallback(() => setHistory([]), []);

  const submit = useCallback((rawArg) => {
    const raw = (rawArg !== undefined ? rawArg : input);
    const display = (
      <div>
        <Prompt /><span>{raw}</span>
      </div>
    );
    setHistory((h) => [...h, display]);
    if (raw.trim()) setCmdHist((h) => [...h, raw.trim()]);
    setInput('');
    setHistPtr(-1);

    const result = runCommand(raw, { clear });
    if (result) setHistory((h) => [...h, <div key={Math.random()} className="mt-2 mb-5">{result}</div>]);
  }, [input, clear]);

  const completions = input.trim()
    ? COMMANDS.filter(c => c.startsWith(input.trim().toLowerCase()))
    : [];

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); return; }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (completions.length === 1) setInput(completions[0] + ' ');
      else if (completions.length > 1) {
        setHistory((h) => [...h, <div key={Math.random()} className="text-muted">{completions.join('   ')}</div>]);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = histPtr === -1 ? cmdHistory.length - 1 : Math.max(0, histPtr - 1);
      setHistPtr(next);
      setInput(cmdHistory[next]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histPtr === -1) return;
      const next = histPtr + 1;
      if (next >= cmdHistory.length) { setHistPtr(-1); setInput(''); }
      else { setHistPtr(next); setInput(cmdHistory[next]); }
      return;
    }

    if (e.ctrlKey && e.key === 'l') { e.preventDefault(); clear(); return; }
    if (e.ctrlKey && e.key === 'c') { e.preventDefault(); setInput(''); setHistPtr(-1); return; }
  };

  return (
    <div className="scanlines vignette">
      <div className="topbar">
        <div className="lights">
          <span className="light light-r" />
          <span className="light light-y" />
          <span className="light light-g" />
        </div>
        <div className="titlebar">navendra@portfolio:~ — 80×24</div>
        <a href="/" className="text-muted hover:text-accent text-xs">visual version →</a>
      </div>

      <div ref={scrollRef} className="terminal-shell">
        <div className="mb-3">
          <Prompt /><span className="text-muted">whoami</span>
        </div>
        <pre className="text-fg">{intro}{!introDone && <span className="caret">&nbsp;</span>}</pre>

        {introDone && (
          <>
            <div className="mt-4 text-muted">
              type <span className="text-accent">help</span> for a list of commands. tab-completes, ↑/↓ for history.
            </div>

            <div className="mt-6">
              {history.map((line, i) => <div key={i}>{line}</div>)}
            </div>

            <div className="mt-1 flex items-start">
              <Prompt />
              <input
                ref={inputRef}
                className="prompt-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="terminal input"
              />
            </div>
          </>
        )}
      </div>

      <div className="mobile-hint md:hidden">
        {['help','datapilot','datapilot --architecture','work','experience','stack','contact','clear'].map(c => (
          <button key={c} onClick={() => submit(c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}
