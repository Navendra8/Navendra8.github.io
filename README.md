# navendra8.github.io

Personal portfolio site for Navendra Singh — AI Engineer, Newcastle UK.

Live at [navendra8.github.io](https://navendra8.github.io).

## Stack

Pure HTML + CSS. Zero build step. Cormorant Garamond for headings, system sans for body. Hosted on GitHub Pages.

## Structure

```
├── index.html              Home — hero + selected work + philosophy + contact
├── projects.html           Projects — full project list
├── experience.html         Experience — full career timeline
├── about.html              About — longer personal story
├── contact.html            Contact — how to reach me
├── 404.html                Custom not-found page
├── styles.css              All styles (light/dark mode, responsive)
└── projects/
    ├── datapilot.html      DataPilot case study
    ├── ai-insider.html     Harwin AI Insider case study
    └── reporting-automation.html   Reporting automation case study
```

## Deploy

GitHub Pages serves this repo directly from `main`. Any push to `main` is live within a minute.

```bash
git add .
git commit -m "Update content"
git push
```

## Local preview

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Adding a new project

1. Duplicate any file in `projects/` as a template.
2. Update the eyebrow, h1, lede, meta grid, and prose sections.
3. Add a new `.work-item` to both `index.html` (selected work) and `projects.html` (full list).
