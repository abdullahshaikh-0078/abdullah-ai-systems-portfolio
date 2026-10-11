# Abdullah Mukhtar Shaikh — AI Systems Portfolio

> **Production-grade AI Engineer portfolio showcasing Autonomous Agents, Multi-Strategy RAG Systems, and Cloud Automation Architecture.**

---

## 🏛️ Executive Overview

This repository houses the personal AI Systems portfolio and interactive case-study platform for **Abdullah Mukhtar Shaikh**, AI Engineer specializing in Generative AI, Retrieval-Augmented Generation (RAG), Autonomous Agentic Workflows, and Scalable Cloud Systems.

### Flagship Systems Showcased

1. **AI News Intelligence & Synthesis Platform**
   - Autonomous multi-source AI news engine with automated deduplication (Cosine Similarity via native `pgvector 0.8.6`).
   - Multi-source clustering, 6-signal deterministic ranking, Google Gemini embeddings, and automated newsletter delivery.
   - Deep-dive interactive route: [`projects/ai-news.html`](projects/ai-news.html).

2. **NEXUS RAG: Enterprise Document Intelligence Platform**
   - Multi-strategy retrieval combining dense semantic search (Qdrant HNSW) + sparse keyword retrieval (BM25 Okapi) with Reciprocal Rank Fusion (RRF).
   - Deterministic math guardrails, table-aware chunking, and sub-second query latency.
   - Interactive 3-version architecture evolution comparison (v1 Dense Baseline, v2 Hybrid Fusion, v3 Production Platform).

3. **FastCloud: AI-Powered Natural Language Cloud Automation**
   - Natural language cloud provisioning engine generating verified AWS & Azure infrastructure directly from conversational prompts.
   - Interactive 5-stage architectural gallery (Prompt Bar, Visual Architecture Studio, Deploy CLI Cloud Shell, Telemetry Dashboard, and AI Cloud Copilot).

4. **Nexus AI Assistant**
   - Voice- and text-driven autonomous agent built with Google Gemini, speech recognition, and system automation tools.

---

## 🎨 Design System: Warm Brown & Navy Palette

Inspired by modern editorial engineering platforms, the portfolio features an artisanal design system:

* **Dark Theme (Default)**: Deep Midnight Navy (`#101A28`), elevated surface (`#172435`), warm caramel brown accent (`#C49A76`), and muted steel blue (`#8DA8C5`).
* **Light Theme**: Warm Editorial Ivory (`#F7F4EE`), crisp card surface (`#FFFFFF`), rich roasted brown accent (`#795548`), and deep navy secondary (`#23364D`).
* **Zero Flash of Unstyled Content (FOUC)**: Immediate head execution controller synchronously applies cached or preferred color schemes before DOM render.
* **Ambient AI Background**: Lightweight HTML5 Canvas particle network with automatic reduced-motion detection (`prefers-reduced-motion: reduce`) and visibility-pause listeners.
* **Resume Modal**: In-browser document viewer with custom theme-matched scrollbars and direct PDF download options.

---

## 📂 Repository Architecture

```text
abdullah-ai-systems-portfolio/
├── index.html                   # Primary production landing page & project showcase
├── assets/                      # Production media and documents
│   ├── Abdullah_Mukhtar_Shaikh_Resume.pdf  # Canonical CV download
│   └── images/                  # Optimized WebP previews & photography
│       ├── editorial-workspace-hero.jpg    # Editorial workspace hero photograph
│       ├── resume-page-1.png               # High-DPI resume preview render
│       ├── fastcloud/                      # FastCloud 5-stage gallery slides
│       ├── ai-news-preview.webp            # AI News system preview
│       ├── nexus-agent-preview.webp        # Nexus Assistant preview
│       └── nexus-rag-ui.webp               # NEXUS RAG dashboard preview
├── projects/                    # Deep-dive interactive case studies
│   ├── ai-news.html             # AI News platform interactive dashboard
│   └── demo-preview.html        # NEXUS RAG 10-stage pipeline deep dive
├── styles/                      # Modular CSS Architecture
│   ├── base/                    # Reset, variables, typography, globals
│   ├── components/              # Modular component stylesheets
│   ├── utilities/               # Animations and transitions
│   └── main.css                 # Production compiled stylesheet (auto-generated)
└── scripts/                     # Modular JavaScript Architecture
    ├── core/                    # Theme, API client, scroll reveal
    ├── components/              # Navbar, modals, FastCloud slideshow, copy email
    ├── systems/                 # AI News interactive system controller
    ├── bundle.js                # Self-contained bundle for offline & file:// protocols
    ├── bundle_css.js            # Node.js CSS compilation & brace validation script
    └── verify_portfolio.py      # Production verification test suite
```

---

## 🚀 Local Development & Verification

### 1. Run Local Development Server

Run a lightweight HTTP server in the repository root:

```bash
# Using Python
python -m http.server 8080

# Or using Node.js http-server / npx serve
npx serve -l 8080 .
```

Open `http://localhost:8080/index.html` in your browser.

### 2. Re-Bundle Stylesheets

Whenever modifying modular CSS in `styles/base/` or `styles/components/`, compile `styles/main.css` using:

```bash
node scripts/bundle_css.js
```

The bundler automatically verifies CSS brace balancing across all 15 component modules.

### 3. Run Production Verification Suite

Verify server connectivity, HTML tag nesting, internal anchor targets, CSS balance, and capture headless visual screenshots:

```bash
python scripts/verify_portfolio.py
```

---

## 🔒 Production Standards

* **Zero Framework Overhead**: Built with native semantic HTML5, Vanilla CSS3, and standard ES Modules for sub-100ms first contentful paint (FCP).
* **Dual Execution Model**: Functions seamlessly over standard HTTP servers and offline double-click `file://` environments via `scripts/bundle.js`.
* **Accessibility & SEO**: Semantic landmark tags (`<nav>`, `<main>`, `<section>`, `<footer>`), ARIA attributes on modals and tabs, OpenGraph metadata, and full keyboard navigation.
