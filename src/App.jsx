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
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'About', href: '#about' },
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
            <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold font-body">2026</span>
            <span className="text-white text-xs font-body pr-3">Open to remote UK AI Engineer roles.</span>
          </motion.div>

          <BlurText
            text="I build AI tools that non-technical people actually use."
            delay={90}
            className="text-5xl md:text-6xl lg:text-[5.25rem] font-heading italic text-white leading-[0.9] max-w-4xl"
            style={{ letterSpacing: '-2px' }}
          />

          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-6 text-sm md:text-base text-white/70 font-body font-light leading-relaxed max-w-xl"
          >
            Eight-plus years in data. Now shipping production LLM applications, agentic workflows,
            and the data infrastructure underneath. Creator of DataPilot and Unthread. Based in
            Newcastle, UK.
          </motion.p>

          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="liquid-glass-strong rounded-full px-6 py-3 text-white font-body text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              See Selected Work
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

// ---------- SELECTED WORK ----------
function Work() {
  const projects = [
    {
      n: '01',
      year: '2024',
      title: 'DataPilot',
      body: 'AI query engine that turns plain English into SQL across Oracle and SQL Server. Expert/Tester agent loop: one agent generates, a second validates and self-corrects before execution. Deployed as a Streamlit app inside Harwin\u2019s production data stack, in daily use by non-technical staff.',
      pills: ['Python', 'Claude / GPT APIs', 'Agentic loop', 'Streamlit', 'Oracle', 'SQL Server'],
    },
    {
      n: '02',
      year: '2025',
      title: 'Unthread',
      body: 'Consumer AI product for guided self-therapy, built around the Wolynn Core Language Approach to intergenerational trauma work. Custom AI companion (Maya) with a bespoke system prompt. Full product architecture covering data persistence, an interactive body map, and monetisation.',
      pills: ['Next.js', 'Tailwind', 'LLM API', 'Prompt engineering', 'Product architecture'],
      href: null,
    },
    {
      n: '03',
      year: '2024',
      title: 'Harwin AI Insider',
      body: 'Internal newsletter and enablement platform helping a 200-person precision manufacturer get practical value from LLMs. 24-week content pipeline with HTML email templating and GitHub Pages deployment.',
      pills: ['Python pipeline', 'HTML / CSS', 'GitHub Pages', 'LLM enablement'],
      href: 'https://harwin-1.github.io/harwin-ai-insider/',
    },
  ];

  return (
    <section id="work" className="relative overflow-hidden py-32 px-6 md:px-16">
      <div className="absolute inset-0 z-0 scene-ambient opacity-60" />
      <div className="absolute inset-0 z-0 scene-stars stars-drift opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        <div className="md:w-1/2 md:sticky md:top-32">
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-medium text-white font-body">Selected Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Three projects. All shipped. All in use.
          </h2>
          <p className="mt-5 text-white/60 font-body font-light text-sm md:text-base max-w-md leading-relaxed">
            I'd rather show work I'm genuinely proud of than pad the list. Each of these made a
            real difference to a real team.
          </p>
          <a
            href="mailto:navendra8@gmail.com?subject=Hi%20Nav"
            className="mt-8 liquid-glass-strong rounded-full px-6 py-3 text-white font-body text-sm font-medium inline-flex items-center gap-2"
          >
            Talk About Your Project
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
      title: 'Adoption first. Demos second.',
      body: 'The demo is the easy part. The hard part is the tool a colleague opens on a Tuesday morning at 9am and actually uses. I think about who the user is, what happens when the model is wrong, and whether it still works a month later.',
    },
    {
      title: 'Boring infrastructure is where trust lives.',
      body: 'Database migrations, retry logic, monitoring — the unglamorous layer under the AI. If that layer is flaky, the cleverest model in the world gets abandoned in two weeks. I own that layer because nothing else matters without it.',
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
            Most AI projects fail in the gap between a demo and something a business will actually use every day.
          </h2>
          <p className="mt-6 text-white/60 font-body font-light text-sm md:text-base max-w-xl leading-relaxed">
            I spend more time than most people on that gap. Here's how it shows up in the work.
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
      company: 'Harwin plc',
      note: 'Primary builder of AI tooling and automated data infrastructure. DataPilot (plain-English-to-SQL with Expert/Tester agent loop), an MCP server integrated with Claude Desktop for conversational data analysis, EDI pipelines processing POS data from Avnet, TTI and Digikey, the Bookings/Billings report delivered to the CFO (current version 29), Power BI pipeline monitoring via MCP, and Streamlit/Altair dashboards on Snowflake.',
    },
    {
      dates: 'Oct 2022 — Apr 2023',
      role: 'Data Insight Manager',
      company: 'Brittany Ferries',
      note: 'Deep-dive studies on acquisition, retention and revenue growth across digital and commercial channels. Python pipelines combining web-scraped competitor pricing with NLP sentiment. Mentored a team of analysts.',
    },
    {
      dates: 'Oct 2021 — Oct 2022',
      role: 'Data Insight Manager',
      company: 'ICS-Digital',
      note: 'End-to-end analytics across concurrent Marketing and Product campaigns. Twitter scraping + sentiment pipeline whose findings were published in multiple high-profile news articles. Managed and mentored a team of 5+.',
    },
    {
      dates: 'Jan 2020 — Oct 2021',
      role: 'Senior Data Analyst',
      company: 'GIP Technologies',
      note: 'Pricing recommendation engine for hospitality using k-means for segment-based pricing. Customer segmentation models identifying new monetisation opportunities. CI with Jenkins, testing with Mockito.',
    },
    {
      dates: 'Mar 2017 — Aug 2019',
      role: 'Data Analyst',
      company: 'GK Telecom',
      note: 'Trend prediction models in Python for merchandising and inventory. End-to-end data prep, normalisation and predictive modelling across sales and market data.',
    },
  ];

  const stackGroups = [
    {
      label: 'AI & LLM',
      items: ['LLM APIs (Claude, GPT)', 'Prompt engineering', 'Agentic workflows', 'MCP protocol', 'RAG', 'LLM evaluation', 'Streamlit'],
    },
    {
      label: 'Data Engineering',
      items: ['Python (pandas, Selenium, COM)', 'SQL Server', 'Oracle', 'MySQL', 'Snowflake', 'ETL pipelines', 'EDI', 'AWS'],
    },
    {
      label: 'Analytics & BI',
      items: ['Power BI', 'DAX', 'Tableau', 'KPI dashboards', 'Predictive modelling', 'Segmentation (k-means)', 'NLP / sentiment'],
    },
    {
      label: 'Product & Delivery',
      items: ['Next.js', 'Tailwind', 'Full-stack AI products', 'Git', 'Jira', 'Stakeholder management'],
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
            Eight years. SQL to agents.
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
              Best reached by email or LinkedIn. I reply the same day. Open to remote UK AI Engineer
              roles and to conversations about interesting problems.
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
          <Work />
          <Philosophy />
          <Experience />
          <CtaFooter />
        </div>
      </div>
    </div>
  );
}
