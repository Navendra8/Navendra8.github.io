import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Menu, X, Github, Linkedin } from 'lucide-react';

// ---------- BlurText ----------
function BlurText({ text, delay = 80, className = '', style = {} }) {
  const words = text.split(' ');
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <h1 ref={ref} className={className} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: '0.25em' }}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 40 }}
          animate={inView ? {
            filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
            opacity: [0, 0.5, 1],
            y: [40, -4, 0],
          } : {}}
          transition={{ duration: 0.7, delay: (i * delay) / 1000, ease: 'easeOut' }}
        >
          {w}
        </motion.span>
      ))}
    </h1>
  );
}

// ---------- Cosmic backdrop (subtle) ----------
function Backdrop() {
  return (
    <>
      <div className="absolute inset-0 z-0 slow-pan scene-ambient" />
      <div className="absolute inset-0 z-0 scene-stars stars-drift opacity-60" />
      <div className="absolute inset-0 z-0 scene-stars opacity-25 twinkle" style={{ backgroundPosition: '250px 120px' }} />
    </>
  );
}

// ---------- NAVBAR ----------
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'DataPilot', href: '#datapilot' },
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="font-heading italic text-2xl text-white">Navendra Singh</span>
        </a>

        <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1 items-center gap-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-white/80 font-body hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:navendra8@gmail.com"
            className="bg-white text-black rounded-full px-4 py-2 text-sm font-semibold font-body flex items-center gap-1 hover:bg-white/90 transition-colors ml-1"
          >
            Email Me
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden liquid-glass rounded-full p-2.5 text-white"
          aria-label="menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-3 max-w-6xl mx-auto">
          <div className="liquid-glass rounded-2xl p-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-white/80 font-body hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="mailto:navendra8@gmail.com"
              className="mt-2 bg-white text-black rounded-full px-4 py-3 text-sm font-semibold font-body flex items-center justify-center gap-1"
            >
              Email Me
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ---------- HERO ----------
function Hero() {
  const places = ['Harwin', 'Brittany Ferries', 'ICS-Digital', 'GIP Technologies', 'GK Telecom'];
  return (
    <section id="top" className="relative overflow-hidden min-h-screen">
      <Backdrop />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 pt-32 md:pt-40 px-6 md:px-16 lg:px-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="liquid-glass rounded-full px-1 py-1 inline-flex items-center gap-2 mb-8"
          >
            <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold font-body">Open</span>
            <span className="text-white text-xs font-body pr-3">Hybrid London or fully remote AI Engineer roles.</span>
          </motion.div>

          <BlurText
            text="Production LLM systems on enterprise data."
            delay={90}
            className="text-5xl md:text-6xl lg:text-[5.5rem] font-heading italic text-white leading-[0.9] max-w-4xl"
            style={{ letterSpacing: '-2px' }}
          />

          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-6 text-sm md:text-base text-white/70 font-body font-light leading-relaxed max-w-xl"
          >
            AI Engineer inside a 400-person regulated manufacturer (aerospace, defence, medical).
            Builder of <span className="text-white">DataPilot</span> — a text-to-SQL agent with a
            self-correcting Expert / Tester loop serving 150+ business users against live Oracle IFS
            and SQL Server. 8+ years across Python, SQL, and cloud data engineering.
          </motion.p>

          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#datapilot"
              className="liquid-glass-strong rounded-full px-6 py-3 text-white font-body text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              See DataPilot Architecture
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:navendra8@gmail.com"
              className="text-white font-body text-sm font-light flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Mail className="h-4 w-4" />
              navendra8@gmail.com
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="px-6 md:px-16 lg:px-24 pb-10 pt-8"
        >
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-white/40 text-xs font-body uppercase tracking-widest">
              Eight years · Five companies
            </p>
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              {places.map((p) => (
                <span
                  key={p}
                  className="text-lg md:text-xl font-heading italic text-white/55 hover:text-white transition-colors cursor-default"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------- FLAGSHIP: DATAPILOT ----------
function DataPilot() {
  const stats = [
    { v: '150+', l: 'Business users in Sales, Ops, Finance' },
    { v: '~90%', l: 'First-pass SQL accuracy via Tester loop' },
    { v: '< 5s', l: 'Median query latency' },
    { v: '400', l: 'Person regulated manufacturer' },
  ];

  const sections = [
    {
      label: 'What it does',
      body: 'Lets 150–200 non-technical users across Sales, Ops, and Finance query live Oracle IFS and SQL Server data in natural language — nearly half of a 400-person business.',
    },
    {
      label: 'Architecture',
      body: 'Two-agent system. An Expert agent generates SQL from schema-aware prompts; a Tester agent validates syntax, executes against a sandboxed read replica, inspects result shape, and loops corrections back before surfacing output.',
    },
    {
      label: 'Why this pattern',
      body: 'Expert / Tester over single-shot generation and over a full ReAct loop. Single-shot fails quietly on schema edge cases; ReAct burns tokens on reasoning better expressed as a deterministic validation step. The Tester loop closes the accuracy gap where it matters — valid SQL against a real schema — without paying ReAct’s latency and cost.',
    },
    {
      label: 'Guardrails',
      body: 'Read-only enforcement at the connection layer, row limits, query-timeout fallback, and graceful degradation when the Tester cannot validate inside the retry budget. Schema snapshots versioned so prompt changes and schema changes are auditable.',
    },
  ];

  const stack = ['Python', 'Streamlit', 'Claude API', 'GPT API', 'Oracle IFS', 'SQL Server', 'Custom query telemetry'];

  return (
    <section id="datapilot" className="relative overflow-hidden py-32 px-6 md:px-16">
      <div className="absolute inset-0 z-0 scene-ambient opacity-70" />
      <div className="absolute inset-0 z-0 scene-stars stars-drift opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-14">
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-medium text-white font-body">Flagship Project</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] max-w-3xl">
            DataPilot — text-to-SQL with a self-correcting Expert / Tester loop.
          </h2>
          <p className="mt-6 text-white/65 font-body font-light text-sm md:text-base max-w-2xl leading-relaxed">
            The flagship AI product at Harwin. A two-agent system that turns plain English into
            validated SQL against live Oracle IFS and SQL Server, with real guardrails and real
            telemetry.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="liquid-glass rounded-2xl p-6"
            >
              <div className="text-4xl md:text-5xl font-heading italic text-white leading-none">{s.v}</div>
              <div className="mt-3 text-white/55 font-body font-light text-xs leading-relaxed">{s.l}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="liquid-glass rounded-2xl p-7"
            >
              <div className="text-white/45 font-body text-xs uppercase tracking-widest mb-3">
                {s.label}
              </div>
              <p className="text-white/85 font-body font-light text-sm md:text-base leading-relaxed">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {stack.map((t) => (
            <span
              key={t}
              className="liquid-glass rounded-full px-3.5 py-1.5 text-white/80 font-body text-xs"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- ALSO SHIPPED ----------
function Work() {
  const projects = [
    {
      n: '01',
      year: '2024',
      title: 'Harwin AI Insider',
      body: '24-week internal LLM enablement platform serving all 400 staff. Measurable increase in internal AI-tool adoption and a drop in ad-hoc data requests.',
      pills: ['Python pipeline', 'HTML / CSS', 'GitHub Pages', 'Enablement'],
      href: 'https://harwin-1.github.io/harwin-ai-insider/',
    },
    {
      n: '02',
      year: '2024',
      title: 'MCP Server for Claude Desktop',
      body: 'Custom Anthropic MCP server exposing the MySQL warehouse as tools inside Claude Desktop. Conversational access to pipeline and operational data without opening a BI tool.',
      pills: ['MCP', 'Claude Desktop', 'MySQL', 'Tool use'],
      href: null,
    },
    {
      n: '03',
      year: '2023 — 2025',
      title: 'Data Platform Rebuild',
      body: 'AWS Data Lake + Snowflake analytical layer consolidating ERP, CRM, and distributor sources. Distributor POS rebuilt from a full-day Access/SQL/R/Python/Excel patchwork into a single Python pipeline under 5 minutes. One critical reporting process cut from 24 hours to 30.',
      pills: ['AWS', 'Snowflake', 'Python', 'n8n', 'ETL'],
      href: null,
    },
  ];

  return (
    <section id="work" className="relative overflow-hidden py-32 px-6 md:px-16">
      <div className="absolute inset-0 z-0 scene-stars opacity-20 twinkle" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        <div className="md:w-1/2 md:sticky md:top-32">
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-medium text-white font-body">Also Shipped</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            The rest of the surface area.
          </h2>
          <p className="mt-5 text-white/60 font-body font-light text-sm md:text-base max-w-md leading-relaxed">
            DataPilot doesn't exist in isolation. It sits on a data platform and alongside the
            enablement work that taught 400 people how to actually use AI at work.
          </p>
          <a
            href="mailto:navendra8@gmail.com?subject=Hi%20Nav"
            className="mt-8 liquid-glass-strong rounded-full px-6 py-3 text-white font-body text-sm font-medium inline-flex items-center gap-2"
          >
            Talk About Your Problem
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="md:w-1/2 flex flex-col gap-8">
          {projects.map((p) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="liquid-glass rounded-2xl p-8"
            >
              <div className="flex items-baseline justify-between">
                <div className="text-white/30 font-heading italic text-5xl">{p.n}</div>
                <div className="text-white/40 font-body text-xs tracking-widest">{p.year}</div>
              </div>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h3 className="text-2xl font-heading italic text-white">{p.title}</h3>
                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 hover:text-white transition-colors shrink-0 mt-1"
                    aria-label={`Open ${p.title}`}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                )}
              </div>
              <p className="mt-2 text-white/60 font-body font-light text-sm leading-relaxed">
                {p.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.pills.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-body text-white/70 border border-white/15 rounded-full px-2.5 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- PHILOSOPHY ----------
function Philosophy() {
  const rows = [
    {
      title: 'Pick the simplest architecture that closes the real gap.',
      body: 'Single-shot generation, Expert / Tester, full ReAct — they all "work" in a demo. The question is which one closes the actual failure mode for this problem. For DataPilot it was valid SQL against a real schema, so a deterministic validation step beats open-ended reasoning. Match the pattern to the gap, not to fashion.',
    },
    {
      title: 'Guardrails are part of the product.',
      body: 'Read-only connections, row limits, query-timeout fallback, graceful degradation, versioned schema snapshots. These are not polish — they’re what lets an LLM touch a production database without becoming a liability. Ship them alongside the model, not after.',
    },
  ];

  return (
    <section id="about" className="relative py-32 px-6 md:px-16">
      <div className="absolute inset-0 scene-stars opacity-20 twinkle pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="mb-20">
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-medium text-white font-body">What I Care About</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] max-w-2xl">
            Architecture is a judgment call. Guardrails are a feature.
          </h2>
          <p className="mt-6 text-white/60 font-body font-light text-sm md:text-base max-w-xl leading-relaxed">
            Two convictions shaped every production LLM decision I’ve made at Harwin.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {rows.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-start md:items-center gap-10`}
            >
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-[0.95]">
                  {r.title}
                </h3>
                <p className="mt-5 text-white/60 font-body font-light text-sm md:text-base leading-relaxed max-w-md">
                  {r.body}
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="liquid-glass rounded-2xl overflow-hidden relative h-64 md:h-80 w-full">
                  <div className="absolute inset-0 scene-ambient opacity-80" />
                  <div className="absolute inset-0 scene-stars opacity-50 twinkle" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- EXPERIENCE ----------
function Experience() {
  const roles = [
    {
      dates: 'Sep 2023 — Present',
      role: 'Data Engineer & AI Builder',
      company: 'Harwin — UK',
      note: 'Sole builder of the AI product surface and primary engineer on the automated data platform, delivering directly into Finance Leadership. DataPilot (flagship), a custom Anthropic MCP server exposing the MySQL warehouse inside Claude Desktop, the Harwin AI Insider 24-week enablement programme for all 400 staff, n8n-driven automated analytics pipelines (up to 95% turnaround reduction), AWS Data Lake + Snowflake consolidating ERP/CRM/distributor sources, and the distributor POS rebuild (full-day patchwork → single Python pipeline under 5 minutes). Tableau and Streamlit executive KPI dashboards. Data integrity, validation and governance across the analytics function.',
    },
    {
      dates: 'Oct 2022 — Apr 2023',
      role: 'Data Insight Manager',
      company: 'Brittany Ferries — UK',
      note: 'UK–France ferry operator, £450m+ revenue. Deep-dive studies on acquisition, retention and revenue growth. Python pipelines combining web-scraped competitor pricing with NLP sentiment into a single commercial-intelligence view. Mentored a team of analysts.',
    },
    {
      dates: 'Oct 2021 — Oct 2022',
      role: 'Data Insight Manager',
      company: 'ICS-Digital — Leeds, UK',
      note: 'End-to-end analytics across concurrent Marketing and Product campaigns. Twitter scraping + sentiment pipeline whose findings were published across multiple high-profile news articles. Shipped automation that improved analytics processing efficiency by 40%+. Managed 5+ analysts and tech executives.',
    },
    {
      dates: 'Jan 2020 — Oct 2021',
      role: 'Data Analyst',
      company: 'GIP Technologies — Jaipur, India',
      note: 'Pricing recommendation engine using k-means clustering for segment-based pricing across hotel segments. Customer segmentation models identifying new user segments and monetisation opportunities.',
    },
    {
      dates: 'Mar 2017 — Aug 2019',
      role: 'Data Analyst',
      company: 'GK Telecom — Edinburgh, UK',
      note: 'Trend prediction models in Python for merchandising and inventory. End-to-end data preparation, normalisation and predictive modelling; evaluated and validated models to improve accuracy.',
    },
  ];

  const stackGroups = [
    {
      label: 'AI & LLM Engineering',
      items: ['Claude API', 'OpenAI API', 'Anthropic MCP', 'Expert / Tester loops', 'Prompt engineering', 'Structured outputs', 'Tool use', 'RAG', 'LLM evaluation', 'Guardrails', 'Token & cost optimisation', 'Query telemetry'],
    },
    {
      label: 'Automation & Data Engineering',
      items: ['n8n', 'Python', 'AWS Data Lake', 'Snowflake', 'ETL / ELT', 'Data modelling', 'EDI', 'Integrity & validation frameworks'],
    },
    {
      label: 'Analytics & BI',
      items: ['SQL', 'Tableau', 'Power BI', 'Amazon QuickSight', 'Streamlit', 'KPI dashboards', 'GTM analytics'],
    },
    {
      label: 'ML & Advanced Analytics',
      items: ['Predictive modelling', 'Forecasting', 'Segmentation (clustering)', 'NLP / sentiment', 'Statistical analysis'],
    },
    {
      label: 'Data Collection & Integration',
      items: ['Selenium', 'BeautifulSoup', 'Scrapy', 'REST APIs', 'Structured & unstructured data'],
    },
    {
      label: 'Databases & Storage',
      items: ['Snowflake', 'MySQL', 'Microsoft SQL Server', 'Oracle IFS', 'MS Access'],
    },
  ];

  return (
    <section id="experience" className="relative overflow-hidden py-32 px-6 md:px-16">
      <Backdrop />
      <div
        className="absolute inset-x-0 top-0 z-[1]"
        style={{ height: 200, background: 'linear-gradient(to bottom, #000, transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-[1]"
        style={{ height: 200, background: 'linear-gradient(to top, #000, transparent)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-medium text-white font-body">Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Eight-plus years. SQL to agents.
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {roles.map((r, i) => (
            <motion.div
              key={r.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="liquid-glass rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-8"
            >
              <div className="text-white/50 font-body text-xs md:text-sm tracking-wide pt-1">
                {r.dates}
              </div>
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="text-xl md:text-2xl font-heading italic text-white">{r.role}</h3>
                  <span className="text-white/60 font-body text-sm">— {r.company}</span>
                </div>
                <p className="mt-2 text-white/55 font-body font-light text-sm leading-relaxed">
                  {r.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-medium text-white font-body">Current Stack</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {stackGroups.map((g) => (
              <div key={g.label} className="liquid-glass rounded-2xl p-6">
                <div className="text-white/50 font-body text-xs uppercase tracking-widest mb-3">
                  {g.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <span
                      key={t}
                      className="text-[12px] font-body text-white/80 border border-white/15 rounded-full px-2.5 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-medium text-white font-body">Education & Certifications</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="liquid-glass rounded-2xl p-6">
              <div className="text-xl font-heading italic text-white">
                MSc Information Technology (Business)
              </div>
              <div className="mt-1 text-white/60 font-body text-sm">
                Heriot-Watt University, Edinburgh · 2012 – 2013
              </div>
            </div>
            <div className="liquid-glass rounded-2xl p-6">
              <div className="text-white/50 font-body text-xs uppercase tracking-widest mb-3">
                Certifications
              </div>
              <ul className="text-white/80 font-body font-light text-sm space-y-1.5">
                <li>AWS Certified Machine Learning Engineer (Associate) — in progress</li>
                <li>Google Cloud Generative AI — Vertex AI, Prompt Design, GSP519</li>
                <li>Microsoft Certified: Introduction to Programming Using Python (MTA)</li>
                <li>Python with Data Science — Grras Solution Pvt.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- CTA + FOOTER ----------
function CtaFooter() {
  return (
    <section id="contact" className="relative overflow-hidden">
      <Backdrop />
      <div
        className="absolute inset-x-0 top-0 z-[1]"
        style={{ height: 250, background: 'linear-gradient(to bottom, #000, transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-[1]"
        style={{ height: 200, background: 'linear-gradient(to top, #000, transparent)' }}
      />

      <div className="relative z-10 px-6 md:px-16 py-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white leading-[0.85]">
              Let's talk.
            </h2>
            <p className="mt-6 text-white/60 font-body font-light text-sm md:text-base max-w-md leading-relaxed">
              Best reached by email or LinkedIn. I reply the same day. Open to hybrid London or
              fully remote AI Engineer roles, and to conversations about interesting problems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:navendra8@gmail.com"
                className="liquid-glass-strong rounded-full px-6 py-3 text-white font-body text-sm font-medium inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                navendra8@gmail.com
              </a>
              <a
                href="https://linkedin.com/in/navendra-singh"
                target="_blank"
                rel="noreferrer"
                className="liquid-glass rounded-full px-6 py-3 text-white font-body text-sm font-medium inline-flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://github.com/Navendra8"
                target="_blank"
                rel="noreferrer"
                className="liquid-glass rounded-full px-6 py-3 text-white font-body text-sm font-medium inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-white/40 text-xs font-body">Newcastle, UK · © 2026 Navendra Singh</p>
          <div className="flex gap-6">
            <a href="mailto:navendra8@gmail.com" className="text-white/40 text-xs font-body hover:text-white/70 transition-colors">Email</a>
            <a href="https://linkedin.com/in/navendra-singh" className="text-white/40 text-xs font-body hover:text-white/70 transition-colors">LinkedIn</a>
            <a href="https://github.com/Navendra8" className="text-white/40 text-xs font-body hover:text-white/70 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- APP ----------
export default function App() {
  return (
    <div className="bg-black">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <div className="bg-black">
          <DataPilot />
          <Work />
          <Philosophy />
          <Experience />
          <CtaFooter />
        </div>
      </div>
    </div>
  );
}
