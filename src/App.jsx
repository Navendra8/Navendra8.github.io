import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Mail, Github, Linkedin, Check } from 'lucide-react';

// ===========================================================
// NAV
// ===========================================================
function Navbar() {
  return (
    <nav className="fixed top-4 inset-x-0 z-50 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#top" className="font-display italic text-xl text-[color:var(--ink)]">
          Navendra Singh
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
// DATAPILOT LIVE DEMO (the one box that earns its keep)
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

  const [qIdx, setQIdx] = useState(0);
  const [step, setStep] = useState('typing');
  const [typed, setTyped] = useState('');

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
    if (step === 'expert') { const t = setTimeout(() => setStep('tester'), 1100); return () => clearTimeout(t); }
    if (step === 'tester') { const t = setTimeout(() => setStep('done'), 1100); return () => clearTimeout(t); }
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
    <div className="tile tile-ink min-h-[520px] flex flex-col">
      <div className="flex items-center justify-between">
        <span className="kicker" style={{ color: 'rgba(245,241,234,0.65)' }}>Live · DataPilot</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--tile-rose)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--tile-butter)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--tile-sage)]" />
        </div>
      </div>

      <h3 className="mt-4 font-display italic text-3xl md:text-4xl leading-[1.05] text-[color:var(--paper)]">
        Natural language in.<br />Validated SQL out.
      </h3>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="kicker" style={{ color: 'rgba(245,241,234,0.5)' }}>Prompt</div>
        <div className="mt-2 font-ui text-[color:var(--paper)] text-base min-h-[1.5em]">
          {typed}{step === 'typing' && <span className="caret">▍</span>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <AgentPill label="Expert agent" sub="Generates SQL" active={step === 'expert'} done={['tester','done'].includes(step)} />
        <AgentPill label="Tester agent" sub="Validates & retries" active={step === 'tester'} done={step === 'done'} />
      </div>

      <div className="mt-4 flex-1 rounded-2xl border border-white/10 bg-black/40 p-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="kicker" style={{ color: 'rgba(245,241,234,0.5)' }}>SQL</div>
          <AnimatePresence>
            {step === 'done' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[11px] font-ui text-emerald-400">
                <Check className="h-3.5 w-3.5" /> Validated · &lt; 5s
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          {(step === 'tester' || step === 'done') ? (
            <motion.pre key={qIdx + step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-2 font-mono text-[12.5px] leading-relaxed text-emerald-200/90 whitespace-pre-wrap">
              {q.sql}
            </motion.pre>
          ) : (
            <div className="mt-2 font-mono text-[12.5px] text-white/30">— awaiting generation —</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AgentPill({ label, sub, active, done }) {
  const bg = done
    ? 'bg-emerald-500/20 border-emerald-400/40'
    : active
    ? 'bg-[color:var(--tile-terracotta)]/20 border-[color:var(--tile-terracotta)]/60'
    : 'bg-white/5 border-white/10';
  const icon = done
    ? <Check className="h-3.5 w-3.5 text-emerald-400" />
    : active
    ? <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--tile-terracotta)] status-dot" />
    : <span className="w-1.5 h-1.5 rounded-full bg-white/30" />;
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
// HERO — editorial two-column. Type on left, demo on right.
// ===========================================================
function Hero() {
  return (
    <section id="top" className="relative pt-28 md:pt-36 pb-24 px-4 md:px-8 paper-grain">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="status-dot w-2 h-2 rounded-full bg-emerald-600" />
            <span className="kicker">Available · Hybrid London or fully remote</span>
          </div>

          <h1 className="font-display italic text-[2.75rem] md:text-[4rem] lg:text-[5.25rem] leading-[0.92] tracking-tight text-[color:var(--ink)]">
            Production <span className="not-italic">LLM</span> systems<br />
            on <span className="text-[color:var(--tile-terracotta)]">enterprise data</span>.
          </h1>

          <p className="mt-8 text-[color:var(--ink-2)] font-ui text-base md:text-lg leading-relaxed max-w-xl">
            AI Engineer inside a 400-person regulated manufacturer (aerospace, defence, medical).
            Builder of <em className="font-display italic">DataPilot</em> — a text-to-SQL agent with a
            self-correcting Expert / Tester loop, serving 150+ business users against live Oracle IFS
            and SQL Server.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#datapilot" className="bg-[color:var(--ink)] text-[color:var(--paper)] rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 hover:bg-black/80 transition-colors">
              See DataPilot <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:navendra8@gmail.com" className="rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 border border-black/15 hover:bg-black/5 transition-colors">
              <Mail className="h-4 w-4" /> Say hi
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-[color:var(--muted)] font-ui text-sm">
            <span>Newcastle, UK</span>
            <span className="w-1 h-1 rounded-full bg-[color:var(--muted)]" />
            <span>8+ years in data</span>
            <span className="w-1 h-1 rounded-full bg-[color:var(--muted)]" />
            <span>Python · SQL · Claude / GPT · MCP</span>
          </div>
        </div>

        <div>
          <DataPilotDemo />
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// DATAPILOT — flowing editorial deep-dive, not boxes
// ===========================================================
function DataPilotDeep() {
  return (
    <section id="datapilot" className="relative py-24 md:py-32 px-4 md:px-8 bg-[color:var(--paper-2)]">
      <div className="max-w-3xl mx-auto">
        <div className="kicker text-[color:var(--muted)]">Flagship Project</div>
        <h2 className="mt-3 font-display italic text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
          DataPilot
        </h2>
        <p className="mt-4 font-display italic text-2xl md:text-3xl text-[color:var(--muted)] leading-tight max-w-2xl">
          A text-to-SQL agent with a self-correcting Expert / Tester loop.
        </p>

        {/* Inline stat row — numbers inline, not in boxes */}
        <div className="mt-12 grid grid-cols-3 gap-8 hairline pt-8 pb-8 border-b border-black/10">
          <Inline stat="150+" label="business users in Sales, Ops, Finance" />
          <Inline stat="~90%" label="first-pass SQL accuracy" />
          <Inline stat={<>&lt;5s</>} label="median query latency" />
        </div>

        {/* Running copy */}
        <div className="mt-14 space-y-10 text-[color:var(--ink-2)] font-ui text-[17px] leading-[1.75]">
          <Prose label="What it does">
            Lets 150–200 non-technical users across Sales, Ops, and Finance query live Oracle IFS and
            SQL Server data in natural language — nearly half of a 400-person business. Running in
            production since 2024.
          </Prose>

          <Prose label="Architecture">
            Two-agent system. An <strong className="text-[color:var(--ink)]">Expert</strong> agent generates
            SQL from schema-aware prompts; a <strong className="text-[color:var(--ink)]">Tester</strong> agent
            validates syntax, executes against a sandboxed read replica, inspects result shape, and
            loops corrections back before surfacing output.
          </Prose>

          <Prose label="Why this pattern">
            Expert / Tester over single-shot generation and over a full ReAct loop. Single-shot fails
            quietly on schema edge cases; ReAct burns tokens on reasoning that is better expressed as a
            deterministic validation step. The Tester loop closes the accuracy gap where it matters —
            valid SQL against a real schema — without paying ReAct’s latency and cost.
          </Prose>

          <Prose label="Guardrails">
            Read-only enforcement at the connection layer. Row limits. Query-timeout fallback.
            Graceful degradation when the Tester can’t validate inside the retry budget. Schema
            snapshots versioned so prompt changes and schema changes are auditable.
          </Prose>
        </div>

        <div className="mt-12 pt-8 border-t border-black/10 flex flex-wrap gap-2">
          {['Python','Streamlit','Claude API','GPT API','Oracle IFS','SQL Server','Query telemetry'].map(t => (
            <span key={t} className="text-[12px] font-mono text-[color:var(--muted)] border border-black/15 rounded-full px-2.5 py-1">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Inline({ stat, label }) {
  return (
    <div>
      <div className="font-display italic text-[3rem] md:text-[3.5rem] leading-none text-[color:var(--tile-terracotta)]">
        {stat}
      </div>
      <div className="mt-2 font-ui text-[13px] leading-snug text-[color:var(--muted)]">{label}</div>
    </div>
  );
}

function Prose({ label, children }) {
  return (
    <div className="grid md:grid-cols-[140px_1fr] gap-3 md:gap-10">
      <div className="kicker text-[color:var(--muted)] pt-1.5">{label}</div>
      <p>{children}</p>
    </div>
  );
}

// ===========================================================
// ALSO SHIPPED — typographic list, not cards
// ===========================================================
function AlsoShipped() {
  const items = [
    {
      n: '01',
      title: 'Harwin AI Insider',
      body: '24-week internal LLM enablement platform serving all 400 staff. Measurable increase in AI-tool adoption and a drop in ad-hoc data requests.',
      href: 'https://harwin-1.github.io/harwin-ai-insider/',
      tags: ['Python pipeline', 'HTML / CSS', 'GitHub Pages'],
    },
    {
      n: '02',
      title: 'MCP Server for Claude Desktop',
      body: 'Custom Anthropic MCP server exposing the MySQL warehouse as tools inside Claude Desktop. Leadership gets conversational access to pipeline and operational data without opening a BI tool.',
      tags: ['MCP', 'Claude Desktop', 'MySQL', 'Tool use'],
    },
    {
      n: '03',
      title: 'Data Platform Rebuild',
      body: 'AWS Data Lake + Snowflake analytical layer consolidating ERP, CRM, and distributor sources. Distributor POS rebuilt from a full-day Access/SQL/R/Python/Excel patchwork into a single Python pipeline under 5 minutes. One critical report cut from 24h to 30min.',
      tags: ['AWS', 'Snowflake', 'Python', 'n8n'],
    },
  ];

  return (
    <section id="work" className="relative py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <div className="kicker text-[color:var(--muted)]">Also Shipped</div>
          <h2 className="mt-3 font-display italic text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight max-w-2xl">
            DataPilot doesn’t exist in isolation.
          </h2>
          <p className="mt-4 font-ui text-[color:var(--muted)] text-base max-w-xl">
            It sits on a data platform and alongside the enablement work that taught 400 people how
            to actually use AI at work.
          </p>
        </div>

        <div className="flex flex-col">
          {items.map((p, i) => {
            const Row = p.href ? 'a' : 'div';
            return (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`${i === 0 ? '' : 'border-t border-black/10'} py-10 first:pt-4`}
              >
                <Row
                  href={p.href}
                  target={p.href ? '_blank' : undefined}
                  rel={p.href ? 'noreferrer' : undefined}
                  className={`group grid md:grid-cols-[60px_1fr_auto] gap-4 md:gap-10 items-start ${p.href ? 'cursor-pointer' : ''}`}
                >
                  <div className="font-display italic text-4xl text-[color:var(--muted)]/60">{p.n}</div>
                  <div>
                    <h3 className="font-display italic text-3xl md:text-4xl leading-tight tracking-tight text-[color:var(--ink)] group-hover:text-[color:var(--tile-terracotta)] transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-3 font-ui text-[15px] text-[color:var(--ink-2)] leading-relaxed max-w-2xl">
                      {p.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[11px] font-mono text-[color:var(--muted)] border border-black/10 rounded-full px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                  </div>
                  {p.href && (
                    <ArrowUpRight className="hidden md:block h-6 w-6 text-[color:var(--muted)] group-hover:text-[color:var(--tile-terracotta)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all mt-2" />
                  )}
                </Row>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// EXPERIENCE — editorial timeline with hairlines
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
    <section id="experience" className="relative py-24 md:py-32 px-4 md:px-8 bg-[color:var(--paper-2)]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <div className="kicker text-[color:var(--muted)]">Experience</div>
          <h2 className="mt-3 font-display italic text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
            Eight-plus years. SQL to agents.
          </h2>
        </div>

        <div className="flex flex-col">
          {roles.map((r, i) => (
            <motion.div
              key={r.company}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={`${i === 0 ? '' : 'border-t border-black/10'} py-8 grid md:grid-cols-[170px_1fr] gap-4 md:gap-10`}
            >
              <div className="font-ui text-sm text-[color:var(--muted)] tracking-wide pt-1">
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
// SKILLS + EDU — typographic, category labels in margin
// ===========================================================
function SkillsEdu() {
  const groups = [
    { label: 'AI & LLM', items: ['Claude API', 'OpenAI API', 'Anthropic MCP', 'Expert / Tester loops', 'Prompt engineering', 'Structured outputs', 'Tool use', 'RAG', 'LLM evaluation', 'Guardrails', 'Token & cost optimisation', 'Query telemetry'] },
    { label: 'Automation & Data', items: ['n8n', 'Python', 'AWS Data Lake', 'Snowflake', 'ETL / ELT', 'Data modelling', 'EDI', 'Validation frameworks'] },
    { label: 'Analytics & BI', items: ['SQL', 'Tableau', 'Power BI', 'QuickSight', 'Streamlit', 'KPI dashboards', 'GTM analytics'] },
    { label: 'ML & Advanced', items: ['Predictive modelling', 'Forecasting', 'Segmentation (k-means)', 'NLP / sentiment', 'Statistical analysis'] },
    { label: 'Databases', items: ['Snowflake', 'MySQL', 'MS SQL Server', 'Oracle IFS', 'MS Access'] },
    { label: 'Integration', items: ['Selenium', 'BeautifulSoup', 'Scrapy', 'REST APIs'] },
  ];

  return (
    <section className="relative py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <div className="kicker text-[color:var(--muted)]">Toolkit</div>
          <h2 className="mt-3 font-display italic text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
            How the work gets made.
          </h2>
        </div>

        <div className="flex flex-col">
          {groups.map((g, i) => (
            <div
              key={g.label}
              className={`${i === 0 ? '' : 'border-t border-black/10'} py-6 grid md:grid-cols-[170px_1fr] gap-4 md:gap-10 items-start`}
            >
              <div className="font-display italic text-xl text-[color:var(--muted)] pt-1">
                {g.label}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 font-ui text-[15px] text-[color:var(--ink)]">
                {g.items.map((item, idx) => (
                  <span key={item} className="flex items-center gap-5">
                    {item}
                    {idx < g.items.length - 1 && <span className="text-[color:var(--muted)]/50">/</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-black/10 grid md:grid-cols-2 gap-12">
          <div>
            <div className="kicker text-[color:var(--muted)]">Education</div>
            <div className="mt-3 font-display italic text-2xl md:text-3xl leading-tight">
              MSc Information Technology (Business)
            </div>
            <div className="mt-2 font-ui text-[15px] text-[color:var(--muted)]">
              Heriot-Watt University, Edinburgh · 2012 – 2013
            </div>
          </div>
          <div>
            <div className="kicker text-[color:var(--muted)]">Certifications</div>
            <ul className="mt-3 font-ui text-[15px] text-[color:var(--ink-2)] space-y-2 leading-relaxed">
              <li>AWS Certified Machine Learning Engineer (Associate) — in progress</li>
              <li>Google Cloud Generative AI — Vertex AI, Prompt Design, GSP519</li>
              <li>Microsoft Certified: Introduction to Programming Using Python</li>
              <li>Python with Data Science — Grras Solution Pvt.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// FOOTER — simple, not a tile
// ===========================================================
function Footer() {
  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 md:px-8 bg-[color:var(--paper-2)]">
      <div className="max-w-5xl mx-auto">
        <div className="kicker text-[color:var(--muted)]">Contact</div>
        <h2 className="mt-4 font-display italic text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-tight text-[color:var(--ink)] max-w-4xl">
          Let’s <span className="text-[color:var(--tile-terracotta)]">talk</span>.
        </h2>
        <p className="mt-6 font-ui text-[color:var(--ink-2)] text-base md:text-lg max-w-xl leading-relaxed">
          Email or LinkedIn. I reply the same day. Open to hybrid London or fully remote AI
          Engineer roles, and to conversations about interesting problems.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href="mailto:navendra8@gmail.com" className="bg-[color:var(--ink)] text-[color:var(--paper)] rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 hover:bg-black/80 transition-colors">
            <Mail className="h-4 w-4" /> navendra8@gmail.com
          </a>
          <a href="https://linkedin.com/in/navendra-singh" target="_blank" rel="noreferrer" className="rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 border border-black/15 hover:bg-black/5 transition-colors">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a href="https://github.com/Navendra8" target="_blank" rel="noreferrer" className="rounded-full px-5 py-2.5 text-sm font-ui font-medium inline-flex items-center gap-1.5 border border-black/15 hover:bg-black/5 transition-colors">
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>

        <div className="mt-24 pt-6 border-t border-black/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[color:var(--muted)] font-ui text-xs">
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
      <Hero />
      <DataPilotDeep />
      <AlsoShipped />
      <Experience />
      <SkillsEdu />
      <Footer />
    </div>
  );
}
