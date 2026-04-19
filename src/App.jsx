import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ArrowRight, Mail, Github, Linkedin, MapPin, Check,
  Sparkles, Database, Shield, Terminal, Zap,
} from 'lucide-react';

// ===========================================================
// NAVBAR — minimal pill, top-right
// ===========================================================
function Navbar() {
  return (
    <nav className="fixed top-4 inset-x-0 z-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display italic text-xl text-[color:var(--ink)]">
          <span>Navendra Singh</span>
        </a>
        <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md rounded-full px-1.5 py-1 shadow-sm border border-black/5">
          {[
            ['DataPilot', '#datapilot'],
            ['Work', '#work'],
            ['Experience', '#experience'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <a key={label} href={href} className="px-3.5 py-1.5 text-sm font-ui text-[color:var(--ink-2)] hover:text-[color:var(--ink)] rounded-full hover:bg-black/5 transition-colors">
              {label}
            </a>
          ))}
          <a href="mailto:navendra8@gmail.com" className="ml-1 bg-[color:var(--ink)] text-[color:var(--paper)] rounded-full px-3.5 py-1.5 text-sm font-ui font-medium hover:bg-black/80 transition-colors flex items-center gap-1">
            Email <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </a>
        </div>
        <a href="mailto:navendra8@gmail.com" className="md:hidden bg-[color:var(--ink)] text-[color:var(--paper)] rounded-full p-2.5">
          <Mail className="h-4 w-4" />
        </a>
      </div>
    </nav>
  );
}

// ===========================================================
// HERO TILE — the big one, spans two columns
// ===========================================================
function HeroTile() {
  return (
    <div className="tile tile-cream lg:col-span-2 lg:row-span-2 min-h-[520px] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="status-dot w-2 h-2 rounded-full bg-emerald-600" />
          <span className="kicker">Available · Hybrid London or fully remote</span>
        </div>
        <h1 className="mt-8 font-display italic text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] leading-[0.95] tracking-tight text-[color:var(--ink)]">
          I build <span className="not-italic">production</span><br />
          LLM systems on<br />
          <span className="text-[color:var(--tile-terracotta)]">enterprise data.</span>
        </h1>
        <p className="mt-6 text-[color:var(--muted)] font-ui text-base md:text-lg leading-relaxed max-w-lg">
          AI Engineer inside a 400-person regulated manufacturer
          (aerospace, defence, medical). Eight-plus years across Python, SQL,
          and cloud data engineering. Builder of DataPilot.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-8">
        <a href="#datapilot" className="bg-[color:var(--ink)] text-[color:var(--paper)] rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 hover:bg-black/80 transition-colors">
          See DataPilot <ArrowRight className="h-4 w-4" />
        </a>
        <a href="mailto:navendra8@gmail.com" className="rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 border border-black/15 hover:bg-black/5 transition-colors">
          <Mail className="h-4 w-4" /> Say hi
        </a>
      </div>
    </div>
  );
}

// ===========================================================
// DATAPILOT MINI-DEMO TILE — animated Expert/Tester loop
// ===========================================================
function DataPilotDemo() {
  const queries = [
    {
      nl: 'Top 10 customers by revenue this quarter',
      sql: "SELECT customer_name, SUM(revenue) AS q_revenue\nFROM sales_fact\nWHERE quarter = CURRENT_QUARTER()\nGROUP BY customer_name\nORDER BY q_revenue DESC\nLIMIT 10;",
    },
    {
      nl: 'Distributors with POS below last month',
      sql: "SELECT d.name, SUM(p.units) AS pos_now\nFROM distributor d\nJOIN pos_daily p ON p.dist_id = d.id\nWHERE p.date >= DATE_TRUNC('month', CURRENT_DATE)\nGROUP BY d.name\nHAVING pos_now < last_month_avg(d.id);",
    },
    {
      nl: 'Average bookings lead time by product line',
      sql: "SELECT product_line,\n       AVG(DATEDIFF(day, booked_at, shipped_at)) AS lead_days\nFROM bookings\nWHERE booked_at >= DATEADD(month, -6, CURRENT_DATE)\nGROUP BY product_line\nORDER BY lead_days;",
    },
  ];

  const steps = ['typing', 'expert', 'tester', 'done'];
  const [qIdx, setQIdx] = useState(0);
  const [step, setStep] = useState('typing');
  const [typed, setTyped] = useState('');

  // Type the natural-language query out
  useEffect(() => {
    if (step !== 'typing') return;
    const target = queries[qIdx].nl;
    if (typed.length < target.length) {
      const t = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 35);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep('expert'), 400);
    return () => clearTimeout(t);
  }, [step, typed, qIdx]);

  useEffect(() => {
    if (step === 'expert')  { const t = setTimeout(() => setStep('tester'), 1100); return () => clearTimeout(t); }
    if (step === 'tester')  { const t = setTimeout(() => setStep('done'),   1100); return () => clearTimeout(t); }
    if (step === 'done') {
      const t = setTimeout(() => {
        setTyped('');
        setStep('typing');
        setQIdx((i) => (i + 1) % queries.length);
      }, 3800);
      return () => clearTimeout(t);
    }
  }, [step, qIdx]);

  const q = queries[qIdx];

  return (
    <div className="tile tile-ink lg:col-span-2 lg:row-span-2 min-h-[520px] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="kicker" style={{ color: 'rgba(245,241,234,0.65)' }}>Flagship · DataPilot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--tile-rose)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--tile-butter)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--tile-sage)]" />
        </div>
      </div>

      <h2 className="mt-4 font-display italic text-3xl md:text-4xl leading-[1.05] text-[color:var(--paper)]">
        Natural language in.<br />Validated SQL out.
      </h2>

      {/* Prompt input */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="kicker" style={{ color: 'rgba(245,241,234,0.5)' }}>Prompt</div>
        <div className="mt-2 font-ui text-[color:var(--paper)] text-base min-h-[1.5em]">
          {typed}{step === 'typing' && <span className="caret">▍</span>}
        </div>
      </div>

      {/* Expert → Tester pipeline */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <AgentPill
          label="Expert agent"
          sub="Generates SQL"
          active={step === 'expert'}
          done={['tester', 'done'].includes(step)}
        />
        <AgentPill
          label="Tester agent"
          sub="Validates & retries"
          active={step === 'tester'}
          done={step === 'done'}
        />
      </div>

      {/* SQL output */}
      <div className="mt-4 flex-1 rounded-2xl border border-white/10 bg-black/40 p-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="kicker" style={{ color: 'rgba(245,241,234,0.5)' }}>SQL</div>
          <AnimatePresence>
            {step === 'done' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[11px] font-ui text-emerald-400"
              >
                <Check className="h-3.5 w-3.5" />
                Validated · &lt; 5s
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          {(step === 'tester' || step === 'done') ? (
            <motion.pre
              key={qIdx + step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-2 font-mono text-[12.5px] leading-relaxed text-emerald-200/90 whitespace-pre-wrap"
            >{q.sql}</motion.pre>
          ) : (
            <div className="mt-2 font-mono text-[12.5px] text-white/30">— awaiting generation —</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AgentPill({ label, sub, active, done }) {
  const bg = done ? 'bg-emerald-500/20 border-emerald-400/40' : active ? 'bg-[color:var(--tile-terracotta)]/20 border-[color:var(--tile-terracotta)]/60' : 'bg-white/5 border-white/10';
  const icon = done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : active ? <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--tile-terracotta)] status-dot" /> : <span className="w-1.5 h-1.5 rounded-full bg-white/30" />;
  return (
    <div className={`rounded-2xl border px-4 py-3 transition-colors ${bg}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-ui text-sm font-medium text-[color:var(--paper)]">{label}</span>
      </div>
      <div className="mt-0.5 font-ui text-[11px] text-white/50">{sub}</div>
    </div>
  );
}

// ===========================================================
// SMALLER TILES
// ===========================================================

function StatTile({ value, label, color }) {
  return (
    <div className={`tile ${color} min-h-[200px] flex flex-col justify-between`}>
      <div className="kicker">{label}</div>
      <div className="font-display italic text-[5rem] leading-none">{value}</div>
    </div>
  );
}

function UsersTile() {
  return (
    <div className="tile tile-terracotta min-h-[200px] flex flex-col justify-between">
      <div className="kicker">Live Users</div>
      <div>
        <div className="font-display italic text-[5rem] leading-none">150+</div>
        <div className="mt-2 font-ui text-sm leading-snug">
          non-technical staff in Sales, Ops, and Finance querying live data in plain English.
        </div>
      </div>
    </div>
  );
}

function AccuracyTile() {
  return (
    <div className="tile tile-sage min-h-[200px] flex flex-col justify-between">
      <div className="kicker">First-pass accuracy</div>
      <div>
        <div className="font-display italic text-[5rem] leading-none">~90%</div>
        <div className="mt-2 font-ui text-sm leading-snug">
          via the Tester loop. Median latency under 5 seconds.
        </div>
      </div>
    </div>
  );
}

function LocationTile() {
  return (
    <div className="tile tile-cream min-h-[200px] flex flex-col justify-between">
      <div className="kicker">Based in</div>
      <div>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span className="font-display italic text-3xl">Newcastle, UK</span>
        </div>
        <div className="mt-3 font-ui text-sm text-[color:var(--muted)]">
          Open to hybrid London or fully remote roles.
        </div>
      </div>
    </div>
  );
}

function LearningTile() {
  const items = ['AWS ML Engineer Associate', 'LangGraph workflows', 'RAG eval with RAGAS'];
  return (
    <div className="tile tile-lavender min-h-[200px] flex flex-col">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        <span className="kicker">Currently learning</span>
      </div>
      <ul className="mt-auto space-y-1.5">
        {items.map((i) => (
          <li key={i} className="font-display italic text-xl leading-tight">{i}</li>
        ))}
      </ul>
    </div>
  );
}

function SocialTile() {
  const links = [
    { label: 'GitHub', href: 'https://github.com/Navendra8', icon: Github },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/navendra-singh', icon: Linkedin },
    { label: 'Email', href: 'mailto:navendra8@gmail.com', icon: Mail },
  ];
  return (
    <div className="tile tile-ink min-h-[200px] flex flex-col justify-between">
      <div className="kicker" style={{ color: 'rgba(245,241,234,0.65)' }}>Elsewhere</div>
      <div className="grid grid-cols-3 gap-2">
        {links.map(({ label, href, icon: Icon }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer"
             className="rounded-xl border border-white/10 p-3 flex flex-col items-start gap-2 hover:bg-white/5 transition-colors">
            <Icon className="h-4 w-4" />
            <span className="font-ui text-xs">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ===========================================================
// HERO BENTO GRID
// ===========================================================
function HeroBento() {
  return (
    <section id="top" className="relative pt-24 md:pt-28 pb-10 px-4 md:px-8 paper-grain">
      <div className="max-w-7xl mx-auto">
        {/* 6-column grid on lg, stacks on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-4">
          <HeroTile />
          <DataPilotDemo />
          <UsersTile />
          <AccuracyTile />
          <LocationTile />
          <LearningTile />
          <div className="lg:col-span-2">
            <SocialTile />
          </div>
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// DATAPILOT DEEP-DIVE — below the fold
// ===========================================================
function DataPilotDeep() {
  const cards = [
    {
      icon: Zap,
      color: 'tile-butter',
      label: 'Architecture',
      body: 'Expert agent generates SQL from schema-aware prompts. Tester agent validates syntax, executes against a sandboxed read replica, inspects result shape, and loops corrections back before surfacing output.',
    },
    {
      icon: Terminal,
      color: 'tile-sage',
      label: 'Why this pattern',
      body: 'Expert / Tester over single-shot and over full ReAct. Single-shot fails quietly on schema edge cases. ReAct burns tokens on reasoning better expressed as a deterministic validation step. The loop closes the accuracy gap without paying ReAct’s cost.',
    },
    {
      icon: Shield,
      color: 'tile-rose',
      label: 'Guardrails',
      body: 'Read-only enforcement at the connection layer, row limits, query-timeout fallback, graceful degradation when the Tester can’t validate in budget. Schema snapshots versioned so prompt and schema changes are auditable.',
    },
    {
      icon: Database,
      color: 'tile-blue',
      label: 'Stack',
      body: 'Python · Streamlit · Claude and GPT APIs (model-agnostic at the prompt layer) · Oracle IFS · SQL Server · custom logging for query telemetry and performance monitoring.',
    },
  ];

  return (
    <section id="datapilot" className="relative py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div>
            <div className="kicker text-[color:var(--muted)]">Flagship Project</div>
            <h2 className="mt-3 font-display italic text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight max-w-3xl">
              A text-to-SQL agent with a self-correcting Expert / Tester loop.
            </h2>
          </div>
          <div className="text-[color:var(--muted)] font-ui text-sm max-w-sm">
            Serves nearly half of a 400-person business across Sales, Ops, and Finance.
            Running in production since 2024.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {cards.map(({ icon: Icon, color, label, body }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className={`tile ${color} min-h-[220px] flex flex-col`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="kicker">{label}</span>
              </div>
              <p className="mt-5 font-ui text-[15px] leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// ALSO SHIPPED
// ===========================================================
function AlsoShipped() {
  const items = [
    {
      n: '01',
      title: 'Harwin AI Insider',
      body: '24-week internal LLM enablement platform serving all 400 staff. Measurable increase in AI-tool adoption, drop in ad-hoc data requests.',
      href: 'https://harwin-1.github.io/harwin-ai-insider/',
      tags: ['Python pipeline', 'HTML / CSS', 'GitHub Pages', 'Enablement'],
    },
    {
      n: '02',
      title: 'MCP Server for Claude Desktop',
      body: 'Custom Anthropic MCP server exposing the MySQL warehouse as tools inside Claude Desktop. Conversational access to pipeline and operational data without opening a BI tool.',
      tags: ['MCP', 'Claude Desktop', 'MySQL', 'Tool use'],
    },
    {
      n: '03',
      title: 'Data Platform Rebuild',
      body: 'AWS Data Lake + Snowflake analytical layer consolidating ERP, CRM, and distributor sources. Distributor POS rebuilt from a full-day Access/SQL/R/Python/Excel patchwork into a single Python pipeline under 5 minutes. One critical report cut from 24h to 30min.',
      tags: ['AWS', 'Snowflake', 'Python', 'n8n', 'ETL'],
    },
  ];

  return (
    <section id="work" className="relative py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="kicker text-[color:var(--muted)]">Also Shipped</div>
          <h2 className="mt-3 font-display italic text-4xl md:text-5xl leading-[0.95] tracking-tight">
            DataPilot doesn’t exist in isolation.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {items.map((p) => (
            <motion.a
              key={p.n}
              href={p.href || '#'}
              target={p.href ? '_blank' : undefined}
              rel={p.href ? 'noreferrer' : undefined}
              onClick={(e) => !p.href && e.preventDefault()}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className={`tile tile-cream ${p.href ? 'tile-link' : ''} min-h-[300px] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display italic text-4xl text-[color:var(--muted)]">{p.n}</span>
                  {p.href && <ArrowUpRight className="h-5 w-5 text-[color:var(--ink)]" />}
                </div>
                <h3 className="mt-4 font-display italic text-2xl leading-tight">{p.title}</h3>
                <p className="mt-3 font-ui text-[14px] text-[color:var(--muted)] leading-relaxed">{p.body}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[11px] font-ui border border-black/10 rounded-full px-2 py-0.5 text-[color:var(--ink-2)]">{t}</span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// EXPERIENCE — list with hover reveal
// ===========================================================
function Experience() {
  const roles = [
    {
      dates: 'Sep 2023 — Now',
      role: 'Data Engineer & AI Builder',
      company: 'Harwin',
      place: 'UK',
      note: 'Sole builder of the AI product surface and primary engineer on the data platform. DataPilot (flagship), MCP server for Claude Desktop, Harwin AI Insider, n8n automated analytics (up to 95% turnaround cut), AWS Data Lake + Snowflake, distributor POS rebuild (full day → under 5 min), Tableau/Streamlit executive dashboards.',
    },
    {
      dates: 'Oct 2022 — Apr 2023',
      role: 'Data Insight Manager',
      company: 'Brittany Ferries',
      place: 'UK',
      note: 'Deep-dive studies on acquisition, retention, revenue growth. Python pipelines combining web-scraped competitor pricing with NLP sentiment. Mentored a team of analysts.',
    },
    {
      dates: 'Oct 2021 — Oct 2022',
      role: 'Data Insight Manager',
      company: 'ICS-Digital',
      place: 'Leeds, UK',
      note: 'End-to-end analytics across concurrent Marketing and Product campaigns. Twitter scraping + sentiment pipeline whose findings were published across multiple high-profile news articles. Managed 5+ analysts.',
    },
    {
      dates: 'Jan 2020 — Oct 2021',
      role: 'Data Analyst',
      company: 'GIP Technologies',
      place: 'Jaipur, India',
      note: 'Pricing recommendation engine using k-means for segment-based pricing across hotel segments. Customer segmentation identifying new monetisation opportunities.',
    },
    {
      dates: 'Mar 2017 — Aug 2019',
      role: 'Data Analyst',
      company: 'GK Telecom',
      place: 'Edinburgh, UK',
      note: 'Trend prediction models in Python for merchandising and inventory. End-to-end data prep, normalisation, and predictive modelling.',
    },
  ];

  return (
    <section id="experience" className="relative py-20 md:py-28 px-4 md:px-8 bg-[color:var(--paper-2)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="kicker text-[color:var(--muted)]">Experience</div>
          <h2 className="mt-3 font-display italic text-4xl md:text-5xl leading-[0.95] tracking-tight">
            Eight-plus years. SQL to agents.
          </h2>
        </div>

        <div className="flex flex-col">
          {roles.map((r, i) => (
            <motion.div
              key={r.company}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 py-6 hairline first:border-t-0 first:pt-2"
            >
              <div className="font-ui text-xs md:text-sm text-[color:var(--muted)] tracking-wide pt-1">
                {r.dates}
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="font-display italic text-2xl md:text-3xl text-[color:var(--ink)] leading-tight">
                    {r.role}
                  </h3>
                  <span className="text-[color:var(--muted)] font-ui text-sm">— {r.company}, {r.place}</span>
                </div>
                <p className="mt-2 text-[color:var(--ink-2)] font-ui text-[15px] leading-relaxed max-w-3xl">
                  {r.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// SKILLS + EDU — two-column bento
// ===========================================================
function SkillsEdu() {
  const groups = [
    { label: 'AI & LLM Engineering', color: 'tile-ink',
      items: ['Claude API', 'OpenAI API', 'Anthropic MCP', 'Expert / Tester loops', 'Prompt engineering', 'Structured outputs', 'Tool use', 'RAG', 'LLM evaluation', 'Guardrails', 'Token & cost optimisation', 'Query telemetry'] },
    { label: 'Automation & Data Eng.', color: 'tile-cream',
      items: ['n8n', 'Python', 'AWS Data Lake', 'Snowflake', 'ETL / ELT', 'Data modelling', 'EDI', 'Validation frameworks'] },
    { label: 'Analytics & BI', color: 'tile-lavender',
      items: ['SQL', 'Tableau', 'Power BI', 'QuickSight', 'Streamlit', 'KPI dashboards', 'GTM analytics'] },
    { label: 'ML & Advanced Analytics', color: 'tile-sage',
      items: ['Predictive modelling', 'Forecasting', 'Segmentation (k-means)', 'NLP / sentiment', 'Statistical analysis'] },
    { label: 'Databases & Storage', color: 'tile-blue',
      items: ['Snowflake', 'MySQL', 'MS SQL Server', 'Oracle IFS', 'MS Access'] },
    { label: 'Collection & Integration', color: 'tile-rose',
      items: ['Selenium', 'BeautifulSoup', 'Scrapy', 'REST APIs'] },
  ];

  return (
    <section className="relative py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="kicker text-[color:var(--muted)]">Toolkit</div>
          <h2 className="mt-3 font-display italic text-4xl md:text-5xl leading-[0.95] tracking-tight">
            How the work gets made.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <div key={g.label} className={`tile ${g.color} min-h-[180px]`}>
              <div className="kicker" style={g.color === 'tile-ink' ? { color: 'rgba(245,241,234,0.65)' } : {}}>
                {g.label}
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <span
                    key={i}
                    className="text-[12px] font-ui rounded-full px-2.5 py-1"
                    style={{
                      border: g.color === 'tile-ink'
                        ? '1px solid rgba(245,241,234,0.2)'
                        : '1px solid rgba(26,23,20,0.15)',
                    }}
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="tile tile-cream min-h-[160px]">
            <div className="kicker">Education</div>
            <div className="mt-4 font-display italic text-2xl leading-tight">
              MSc Information Technology (Business)
            </div>
            <div className="mt-1 font-ui text-sm text-[color:var(--muted)]">
              Heriot-Watt University, Edinburgh · 2012 – 2013
            </div>
          </div>
          <div className="tile tile-butter min-h-[160px]">
            <div className="kicker">Certifications</div>
            <ul className="mt-4 font-ui text-[14px] space-y-1.5">
              <li>AWS Certified Machine Learning Engineer (Associate) — in progress</li>
              <li>Google Cloud Generative AI — Vertex AI, Prompt Design, GSP519</li>
              <li>Microsoft Certified: Introduction to Programming Using Python (MTA)</li>
              <li>Python with Data Science — Grras Solution Pvt.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// FOOTER
// ===========================================================
function Footer() {
  return (
    <section id="contact" className="relative px-4 md:px-8 pb-10 pt-10 md:pt-20 bg-[color:var(--paper-2)]">
      <div className="max-w-7xl mx-auto">
        <div className="tile tile-ink min-h-[360px] flex flex-col justify-between">
          <div>
            <div className="kicker" style={{ color: 'rgba(245,241,234,0.65)' }}>Contact</div>
            <h2 className="mt-4 font-display italic text-4xl md:text-6xl leading-[0.95] tracking-tight text-[color:var(--paper)]">
              Let’s talk.
            </h2>
            <p className="mt-4 font-ui text-white/70 max-w-lg leading-relaxed">
              Email or LinkedIn. I reply the same day. Open to hybrid London or fully remote
              AI Engineer roles, and to conversations about interesting problems.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a href="mailto:navendra8@gmail.com" className="bg-[color:var(--paper)] text-[color:var(--ink)] rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 hover:bg-white transition-colors">
              <Mail className="h-4 w-4" /> navendra8@gmail.com
            </a>
            <a href="https://linkedin.com/in/navendra-singh" target="_blank" rel="noreferrer" className="rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 border border-white/20 text-[color:var(--paper)] hover:bg-white/5 transition-colors">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a href="https://github.com/Navendra8" target="_blank" rel="noreferrer" className="rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 border border-white/20 text-[color:var(--paper)] hover:bg-white/5 transition-colors">
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[color:var(--muted)] font-ui text-xs">
          <div>Newcastle, UK · © 2026 Navendra Singh</div>
          <div className="flex gap-5">
            <a href="mailto:navendra8@gmail.com" className="hover:text-[color:var(--ink)]">Email</a>
            <a href="https://linkedin.com/in/navendra-singh" className="hover:text-[color:var(--ink)]">LinkedIn</a>
            <a href="https://github.com/Navendra8" className="hover:text-[color:var(--ink)]">GitHub</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// APP
// ===========================================================
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroBento />
      <DataPilotDeep />
      <AlsoShipped />
      <Experience />
      <SkillsEdu />
      <Footer />
    </div>
  );
}
