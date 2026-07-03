# HRM Engineering

Static marketing site for **HRM Engineering Services, P.C.** — a New York–based MEP/FP (mechanical, electrical, plumbing, and fire protection) engineering firm.

**Live site:** [hrmengineering.com](https://hrmengineering.com)

---

## Overview

This is a hand-authored static site: HTML, CSS, and vanilla JavaScript. There is no bundler or build step. SCSS source files exist for some pages; compiled `.css` files are what the browser loads.

The home page uses interactive canvas abstract art (brand-colored, mouse-reactive). Inner pages use a shared maintenance placeholder for building/infrastructure photos until final project imagery is approved.

---

## Site map

| Page | Path |
|------|------|
| Home | `/index.html` |
| Services (scope) | `/pages/services/scope.html` |
| Team | `/pages/teams/teams.html` |
| Projects | `/pages/projects/*.html` |

**Project categories:** Residential / Mixed Use, Restaurants, Offices, Schools, MTA, Healthcare, Warehouse, Banks, Religious Assembly

Shared chrome (header + footer) is loaded at runtime via `fetch` from `global/header/header.html` and `global/footer/footer.html`.

---

## Project structure

```
HRM/
├── index.html              # Home page
├── index.css
├── assets/                 # Images, logos, abstract art, jQuery (legacy)
├── global/                 # Shared styles, header, footer, fonts
├── pages/
│   ├── projects/           # Category pages + project assets
│   ├── services/           # Services scope page + assets
│   └── teams/              # Team roster
└── src/                    # Legacy copy of an older site layout (not deployed)
```

---

## Local development

From the repo root:

```bash
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080). Paths like `/global/...` assume the site is served from the repository root.

---

## Deployment

The site is hosted on Network Solutions via SFTP. Upload everything under the repo root **except** `.venv/`, `.git/`, `src/`, and development-only files (`.scss`, `.map`, `deploy.py`).

A local deploy helper exists (`deploy.py`) but is not committed — it contains server credentials.

---

## Design

| Token | Value |
|-------|--------|
| Primary | `#2e338a` |
| Secondary / accent | `#437cc0`, `#c2e3f4` |
| Deep navy | `#1c2d59` |
| Surface | `#eef2f5`, `#f7f9fb` |
| Text | `#08101b` |

**Fonts:** Proxima Nova (local OTF), Manrope and Cormorant Garamond (Google Fonts).

---

## Key scripts

| File | Role |
|------|------|
| `global/global.js` | Header/footer injection, nav, sticky header |
| `global/header/intro.js` | Home hero typing animation |
| `assets/abstract/abstract-art.js` | Interactive abstract visuals on the home page |
| `pages/teams/teams.js` | Soft portrait processing for team photos |

---

## Contact (client)

**HRM Engineering Services, P.C.**  
102 Jericho Turnpike, Suite 102, Floral Park, NY 11001  
ed@hrmengineering.com · 516-248-0750

MBE / DBE Certified
