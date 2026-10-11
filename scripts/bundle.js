/**
 * Bundled Client Production Script
 * Contains self-contained controllers for Theme, Ambient AI Background,
 * Architecture Modal, Navbar, Copy Email, and Newsletter Form.
 * Runs synchronously across all protocols (HTTP & file://).
 */

(function () {
    'use strict';

    /* ================= 1. THEME CONTROLLER ================= */
    const SUN_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    const MOON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

    function syncThemeButtons(isLight) {
        const btns = document.querySelectorAll('#as-theme-toggle, .as-theme-btn');
        btns.forEach(b => {
            b.innerHTML = isLight ? MOON_SVG : SUN_SVG;
            b.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
            b.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
        });
    }

    function applyTheme(isLight) {
        const root = document.documentElement;
        const body = document.body;
        if (isLight) {
            root.classList.add('as-light-theme');
            root.setAttribute('data-theme', 'light');
            if (body) body.classList.add('as-light-theme');
            try { localStorage.setItem('as-theme', 'light'); } catch (e) { }
        } else {
            root.classList.remove('as-light-theme');
            root.setAttribute('data-theme', 'dark');
            if (body) body.classList.remove('as-light-theme');
            try { localStorage.setItem('as-theme', 'dark'); } catch (e) { }
        }
        syncThemeButtons(isLight);
    }

    function toggleTheme() {
        const isLight = document.documentElement.classList.contains('as-light-theme') ||
            document.documentElement.getAttribute('data-theme') === 'light';
        applyTheme(!isLight);
    }

    window.applyTheme = applyTheme;
    window.toggleTheme = toggleTheme;


    /* ================= 2. ARCHITECTURE MODAL ================= */
    const PROJECT_ARCH_DATA = {
        'nexus-rag': {
            title: 'NEXUS RAG: Enterprise All-Rounder Document Intelligence Platform',
            subtitle: 'Hybrid Dense + Sparse Retrieval Engine with Deterministic Math Guardrails & Table Reconstruction',
            tags: ['Python', 'FastAPI', 'Qdrant', 'BM25', 'Sentence-Transformers', 'Gemini'],
            metrics: [
                { label: 'Recall@10', value: '85.71%' },
                { label: 'MRR@10', value: '0.7738' },
                { label: 'Dataset', value: 'SEC 10-K Benchmarks' },
                { label: 'Arithmetic Accuracy', value: '100% (Deterministic)' }
            ],
            overview: 'Production-grade enterprise RAG platform engineered for universal multi-format document intelligence. Combines dense vector retrieval (Qdrant) and sparse lexical search (BM25) with Reciprocal Rank Fusion, structure-aware table reconstruction, and a deterministic Python arithmetic engine that eliminates LLM hallucinations on quantitative reports.',
            architecture: `[User SEC 10-K Query]
       │
       ├──► [Lexical BM25 Sparse Index]  ──┐
       │                                  ├──► [Reciprocal Rank Fusion (RRF)] ──► [Top-K Chunks]
       └──► [Dense bi-encoder (MiniLM)]  ──┘                                           │
                                                                                       ▼
[Deterministic Math Guardrail Module] ◄── [Structured Table / Metric Parser] ◄────────┘
       │ (Evaluates EBIT, Free Cashflow, Margins via NumPy/SymPy)
       ▼
[Context-Augmented Prompt] ──► [Google Gemini Pro] ──► [Auditable Financial Answer with Citations]`,
            highlights: [
                '<strong>Custom Deterministic Financial Math Module:</strong> Extracted balance sheet tables and numeric statements are routed to a verified mathematical interpreter before LLM synthesis, completely eliminating arithmetic hallucinations.',
                '<strong>Hybrid Retrieval Pipeline:</strong> Combines Qdrant vector similarity with BM25 lexical keyword matching via Reciprocal Rank Fusion, achieving 85.71% Recall@10 on SEC filing QA pairs.',
                '<strong>Frozen V1 Baseline Benchmarks:</strong> Tested and validated against frozen ground-truth SEC 10-K filings with rigorous MRR and Recall evaluation metrics.'
            ],
            github: 'https://github.com/abdullahshaikh-0078'
        },
        'fastcloud': {
            title: 'FastCloud: AI-Powered Natural Language Cloud Automation',
            subtitle: 'Autonomous Multi-Cloud Deployment & Orchestration Engine',
            tags: ['Node.js', 'Express', 'MongoDB', 'AWS SDK', 'Azure SDK', 'Gemini'],
            metrics: [
                { label: 'Cloud Providers', value: 'AWS & Microsoft Azure' },
                { label: 'Execution Model', value: 'Multi-Step Validated DAG' },
                { label: 'Safety Hooks', value: 'Pre-flight Validation & Rollback' },
                { label: 'Storage', value: 'MongoDB Audit Logs' }
            ],
            overview: 'Translates natural-language deployment requests into verified, multi-step cloud deployment workflows across AWS and Azure.',
            architecture: `[Natural Language Deployment Prompt]
       │
       ▼
[Gemini Intent Parser & Parameter Extractor]
       │
       ▼
[Cloud Security & Topology Validator] (Verifies IAM permissions, resource limits, and egress)
       │
       ├──► [AWS SDK Orchestrator]   (EC2, ECS, S3, RDS, Lambda)
       └──► [Azure SDK Orchestrator] (Virtual Machines, Blob Storage, AKS)
       │
       ▼
[Idempotent Deployment Controller & Rollback Handler]
       │
       ▼
[MongoDB Deployment Audit Trail & Status WebSocket Stream]`,
            highlights: [
                '<strong>Multi-Cloud Synthesis:</strong> Deploys cross-cloud microservices spanning AWS infrastructure and Azure cloud primitives with unified state verification.',
                '<strong>Automated Rollback Engine:</strong> Tracks intermediate resource identifiers to safely undo failed deployments in reverse dependency order.',
                '<strong>Comprehensive Audit Trails:</strong> Immutable log records for security reviews and compliance reporting.'
            ],
            github: 'https://github.com/abdullahshaikh-0078'
        },
        'nexus-agent': {
            title: 'Nexus AI Assistant: Custom Agent & MCP Platform',
            subtitle: 'Framework-Free Autonomous Agent with Model Context Protocol Orchestration',
            tags: ['Python', 'Gemini', 'FastMCP', 'Model Context Protocol', 'Voice I/O'],
            metrics: [
                { label: 'Framework Overhead', value: 'Zero (Built from scratch)' },
                { label: 'Protocol', value: 'Model Context Protocol (FastMCP)' },
                { label: 'Audio Latency', value: 'Low-latency Full-Duplex' },
                { label: 'Codebase Understanding', value: 'AST-Level Semantic Map' }
            ],
            overview: 'A lightweight, autonomous AI agent platform constructed entirely without bloated third-party orchestration libraries, utilizing standardized Model Context Protocol for secure tool integration.',
            architecture: `[User Voice / Text Request]
       │
       ▼
[Autonomous Task Planner] ◄──► [Dynamic State Memory Tree]
       │
       ▼ (FastMCP Client Interface)
[Model Context Protocol Hub]
       ├──► Tool 1: File & Code System Introspection (AST-aware)
       ├──► Tool 2: Shell & Runtime Execution Sandbox
       └──► Tool 3: Web & API Intelligence Retrieval
       │
       ▼
[Execution Synthesizer] ──► [Structured Response / Voice Audio Stream]`,
            highlights: [
                '<strong>Framework-Free Design:</strong> Avoids fragile abstraction layers by implementing raw prompt chaining, explicit state trees, and dynamic reflection natively in Python.',
                '<strong>Model Context Protocol (MCP) Native:</strong> Connects to FastMCP tool servers, allowing hot-plugging of custom capabilities and developer tooling.',
                '<strong>Repository-Aware Code Understanding:</strong> Parses abstract syntax trees (AST) to build structural symbol graphs of codebases for targeted context injection.'
            ],
            github: 'https://github.com/abdullahshaikh-0078'
        },
        'ai-news': {
            title: 'AI News Intelligence & Synthesis Platform',
            subtitle: 'Production Autonomous Ingestion, Clustering & Multi-Signal Ranking',
            tags: ['FastAPI', 'PostgreSQL 18', 'pgvector 0.8.6', 'Gemini AI', 'Docker', 'SQLAlchemy'],
            metrics: [
                { label: 'Ingested Articles', value: '1,300+' },
                { label: 'Vector Dimensions', value: '1536-dim' },
                { label: 'Deduplication', value: 'Native pgvector Cosine' },
                { label: 'Ranking Signals', value: '6-Signal Transparent Model' }
            ],
            overview: 'An autonomous intelligence engine crawling, processing, and ranking artificial intelligence developments across 8+ technical streams.',
            architecture: `[8+ Ingestion Sources (ArXiv, RSS, Repos)]
       │
       ▼ (Async Crawler Pipeline)
[Raw Content Normalizer & Content Hasher]
       │
       ▼ (Google Gemini Embedding Service)
[1536-Dimensional Dense Embeddings]
       │
       ▼
[PostgreSQL 18 + pgvector 0.8.6] ──► [Cosine Deduplication (Threshold >= 0.88)]
       │
       ▼
[Transparent 6-Signal Ranking Algorithm] (Velocity, Authority, Depth, Novelty, Engagement, Cross-Source)
       │
       ▼
[FastAPI REST API] ──► [Daily AI Digest Newsletter] & [Live Stream Explorer]`,
            highlights: [
                '<strong>Native Database Vector Deduplication:</strong> Uses pgvector 0.8.6 cosine similarity indexing within PostgreSQL 18 to automatically cluster duplicate reporting into unified story nodes.',
                '<strong>Transparent 6-Signal Ranking:</strong> Computes objective story scores combining velocity, source authority, technical depth, novelty, community engagement, and cross-source corroboration.',
                '<strong>Full Production Test Suite:</strong> Verified with 159 passing pytest test cases covering database schemas, API routes, and digest delivery.'
            ],
            github: 'https://github.com/abdullahshaikh-0078',
            demo: 'projects/ai-news.html'
        }
    };

    function openArchModal(key) {
        const backdrop = document.getElementById('as-arch-modal-backdrop');
        const container = document.getElementById('as-arch-modal-content');
        const data = PROJECT_ARCH_DATA[key];
        if (!backdrop || !container || !data) return;

        const metricsHTML = data.metrics.map(m => `
            <tr>
                <th>${m.label}</th>
                <td><strong>${m.value}</strong></td>
            </tr>
        `).join('');

        const tagsHTML = data.tags.map(t => `<span class="as-tag">${t}</span>`).join(' ');
        const highlightsHTML = data.highlights.map(h => `<li>${h}</li>`).join('');
        const demoBtnHTML = data.demo ? `
            <a href="${data.demo}" class="as-btn as-btn-primary as-btn-sm" style="margin-left:0.5rem;">
                Launch Live Demo &rarr;
            </a>
        ` : '';

        container.innerHTML = `
            <div class="as-arch-modal-header">
                <div>
                    <h3 class="as-arch-modal-title">${data.title}</h3>
                    <p class="as-arch-modal-subtitle">${data.subtitle}</p>
                    <div style="margin-top: 0.75rem;">${tagsHTML}</div>
                </div>
            </div>

            <div class="as-arch-content">
                <p class="as-arch-overview-text">
                    ${data.overview}
                </p>

                <h4>📊 Benchmark &amp; Telemetry Specifications</h4>
                <table class="as-arch-metrics-table">
                    <tbody>
                        ${metricsHTML}
                    </tbody>
                </table>

                <h4>🏗️ Execution &amp; Pipeline Architecture</h4>
                <div class="as-arch-diagram-block"><pre style="margin:0;font-family:inherit;font-size:inherit;">${data.architecture}</pre></div>

                <h4>⚡ Technical Highlights &amp; Innovations</h4>
                <ul class="as-arch-highlights-list">
                    ${highlightsHTML}
                </ul>

                <div class="as-arch-actions-footer">
                    <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="as-btn as-btn-secondary as-btn-sm">
                        View GitHub Repository &rarr;
                    </a>
                    ${demoBtnHTML}
                </div>
            </div>
        `;

        backdrop.style.display = 'flex';
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function closeArchModal() {
        const backdrop = document.getElementById('as-arch-modal-backdrop');
        if (!backdrop) return;
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
        backdrop.style.display = 'none';
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    window.openArchModal = openArchModal;
    window.closeArchModal = closeArchModal;


    /* ================= 3. AMBIENT BACKGROUND ================= */
    class AmbientAIBackground {
        constructor() {
            this.canvas = document.getElementById('as-ambient-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) return;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            this.nodes = [];
            this.nodeCount = window.innerWidth < 768 ? 20 : 38;
            this.connectionDistance = 115;
            this.animationFrameId = null;
            this.isRunning = false;

            this.resize();
            this.createNodes();
            this.bindEvents();
            this.start();
        }

        resize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        createNodes() {
            this.nodes = [];
            for (let i = 0; i < this.nodeCount; i++) {
                this.nodes.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 1,
                    alpha: Math.random() * 0.2 + 0.15
                });
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.resize();
                this.createNodes();
            }, { passive: true });

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) this.stop();
                else this.start();
            });
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            this.animate();
        }

        stop() {
            this.isRunning = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }

        animate() {
            if (!this.isRunning) return;
            this.render();
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }

        render() {
            const isLight = document.documentElement.classList.contains('as-light-theme') ||
                document.documentElement.getAttribute('data-theme') === 'light';

            this.ctx.clearRect(0, 0, this.width, this.height);
            const nodeColor = isLight ? 'rgba(24, 24, 27, ' : 'rgba(244, 244, 245, ';
            const lineColor = isLight ? 'rgba(39, 39, 42, ' : 'rgba(212, 212, 216, ';
            const len = this.nodes.length;

            for (let i = 0; i < len; i++) {
                const node = this.nodes[i];
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0) node.x = this.width;
                else if (node.x > this.width) node.x = 0;
                if (node.y < 0) node.y = this.height;
                else if (node.y > this.height) node.y = 0;

                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = nodeColor + (node.alpha * (isLight ? 0.6 : 0.8)) + ')';
                this.ctx.fill();

                for (let j = i + 1; j < len; j++) {
                    const other = this.nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < this.connectionDistance) {
                        const lineAlpha = (1 - dist / this.connectionDistance) * (isLight ? 0.05 : 0.08);
                        this.ctx.beginPath();
                        this.ctx.moveTo(node.x, node.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.strokeStyle = lineColor + lineAlpha + ')';
                        this.ctx.lineWidth = 0.75;
                        this.ctx.stroke();
                    }
                }
            }
        }
    }


    /* ================= 4. NAVBAR & SCROLL ================= */
    function initNavbar() {
        const navbar = document.querySelector('.as-navbar');
        const mobileToggle = document.getElementById('as-mobile-toggle');
        const navLinks = document.querySelector('.as-nav-links');
        const navItems = document.querySelectorAll('.as-nav-links a[href^="#"]');
        if (!navbar) return;

        const handleScroll = () => {
            if (window.scrollY > 40) navbar.classList.add('as-scrolled');
            else navbar.classList.remove('as-scrolled');
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                const isOpen = navLinks.classList.toggle('as-open');
                mobileToggle.setAttribute('aria-expanded', String(isOpen));
            });
            navLinks.querySelectorAll('a').forEach(l => {
                l.addEventListener('click', () => {
                    navLinks.classList.remove('as-open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }


    /* ================= 5. COPY EMAIL ================= */
    function initCopyEmail() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.as-copy-email-btn');
            if (!btn) return;
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'abdullahmuk2025@gmail.com';
            const toast = btn.querySelector('.as-copied-toast');

            const showToast = () => {
                if (toast) {
                    toast.style.display = 'inline-block';
                    setTimeout(() => { toast.style.display = 'none'; }, 2000);
                }
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(showToast).catch(showToast);
            } else {
                showToast();
            }
        });
    }


    /* ================= 6. NEWSLETTER & CUSTOMIZATION CONTROLLER ================= */
    function initNewsletter() {
        if (window.__newsletterController) return;

        const form = document.getElementById('as-newsletter-form');
        const emailInput = document.getElementById('as-newsletter-email');
        const submitBtn = document.getElementById('as-newsletter-submit-btn');
        const feedback = document.getElementById('as-newsletter-feedback');

        const modal = document.getElementById('as-customization-modal');
        const toggleBtn = document.getElementById('as-customization-toggle-btn');
        const closeBtn = document.getElementById('as-modal-close-btn');
        const cancelBtn = document.getElementById('as-modal-cancel-btn');
        const modalForm = document.getElementById('as-customization-form');
        const modalName = document.getElementById('as-modal-name');
        const modalEmail = document.getElementById('as-modal-email');
        const weeklyGroup = document.getElementById('as-weekly-day-group');
        const prefDay = document.getElementById('as-pref-day');
        const prefTime = document.getElementById('as-pref-time');
        const prefTimezone = document.getElementById('as-pref-timezone');
        const modalFeedback = document.getElementById('as-modal-feedback');
        const modalSaveBtn = document.getElementById('as-modal-save-btn');

        let lastFocusedElement = null;

        function detectTimezone() {
            try {
                return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
            } catch (e) {
                return 'UTC';
            }
        }

        function initTimezone() {
            if (prefTimezone && !prefTimezone.value) {
                prefTimezone.value = detectTimezone();
            }
        }

        function syncFrequencyState() {
            const selected = document.querySelector('input[name="as-frequency"]:checked');
            const val = selected ? selected.value : 'DAILY';

            const cards = document.querySelectorAll('.as-radio-card');
            cards.forEach((card) => {
                const input = card.querySelector('input[type="radio"]');
                if (input && input.checked) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });

            if (weeklyGroup) {
                weeklyGroup.style.display = (val === 'WEEKLY') ? 'block' : 'none';
            }
        }

        function validateEmail(val) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim().toLowerCase());
        }

        function showFeedback(msg, isErr) {
            if (!feedback) return;
            feedback.textContent = msg;
            feedback.className = 'as-newsletter-feedback ' + (isErr ? 'error' : 'success');
            feedback.style.display = 'block';
        }

        function clearFeedback() {
            if (!feedback) return;
            feedback.style.display = 'none';
            feedback.textContent = '';
            feedback.className = 'as-newsletter-feedback';
        }

        function showModalFeedback(msg, isErr) {
            if (!modalFeedback) return;
            modalFeedback.textContent = msg;
            modalFeedback.className = 'as-modal-feedback ' + (isErr ? 'error' : 'success');
            modalFeedback.style.display = 'block';
        }

        function clearModalFeedback() {
            if (!modalFeedback) return;
            modalFeedback.style.display = 'none';
            modalFeedback.textContent = '';
            modalFeedback.className = 'as-modal-feedback';
        }

        function openModal() {
            if (!modal) return;
            lastFocusedElement = document.activeElement;
            clearModalFeedback();

            if (emailInput && emailInput.value.trim() && modalEmail) {
                modalEmail.value = emailInput.value.trim();
            }

            initTimezone();
            syncFrequencyState();

            modal.style.display = 'flex';
            void modal.offsetHeight;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');

            if (modalName && !modalName.value) {
                modalName.focus();
            } else if (modalEmail) {
                modalEmail.focus();
            }
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                modal.style.display = 'none';
                clearModalFeedback();
                if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                    lastFocusedElement.focus();
                }
            }, 200);
        }

        // Initialize timezone & frequency
        initTimezone();
        syncFrequencyState();

        const radios = document.querySelectorAll('input[name="as-frequency"]');
        radios.forEach((radio) => {
            radio.addEventListener('change', syncFrequencyState);
        });

        // Input error reset
        [emailInput, modalEmail, modalName].forEach((inp) => {
            if (!inp) return;
            inp.addEventListener('input', () => {
                inp.classList.remove('as-input-error');
                if (inp === emailInput) clearFeedback();
                if (inp === modalEmail || inp === modalName) clearModalFeedback();
            });
        });

        if (toggleBtn && !toggleBtn.dataset.bound) {
            toggleBtn.dataset.bound = 'true';
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }

        if (closeBtn && !closeBtn.dataset.bound) {
            closeBtn.dataset.bound = 'true';
            closeBtn.addEventListener('click', closeModal);
        }
        if (cancelBtn && !cancelBtn.dataset.bound) {
            cancelBtn.dataset.bound = 'true';
            cancelBtn.addEventListener('click', closeModal);
        }

        if (modal && !modal.dataset.bound) {
            modal.dataset.bound = 'true';
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
            });
        }

        const hasModuleMain = typeof document !== 'undefined' && !!document.querySelector('script[type="module"][src*="main.js"]');

        if (!hasModuleMain && form && !form.dataset.bound) {
            form.dataset.bound = 'true';
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = emailInput ? emailInput.value.trim() : '';
                if (!validateEmail(email)) {
                    if (emailInput) {
                        emailInput.classList.add('as-input-error');
                        emailInput.focus();
                    }
                    showFeedback('Please enter a valid email address.', true);
                    return;
                }

                const btnText = submitBtn ? submitBtn.querySelector('.as-btn-text') : null;
                const btnSpinner = submitBtn ? submitBtn.querySelector('.as-btn-spinner') : null;
                if (submitBtn) submitBtn.disabled = true;
                if (btnText) btnText.textContent = 'Subscribing...';
                if (btnSpinner) btnSpinner.style.display = 'inline-block';

                try {
                    if (window.aiNewsApi && typeof window.aiNewsApi.subscribeToAINews === 'function') {
                        const res = await window.aiNewsApi.subscribeToAINews({ email, frequency: 'DAILY', preferred_channel: 'EMAIL' });
                        showFeedback((res && res.message) || "You're subscribed! The Daily AI Digest will be delivered to your inbox.", false);
                    } else {
                        const apiUrl = (typeof window.buildApiUrl === 'function')
                            ? window.buildApiUrl('/newsletter/subscribe')
                            : ((window.__AI_NEWS_API_URL__ || '') + '/newsletter/subscribe');
                        const res = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({ email: email, frequency: 'DAILY', preferred_channel: 'EMAIL' })
                        });
                        if (!res.ok) {
                            let msg = 'Subscription request failed (' + res.status + ')';
                            try {
                                const errJson = await res.json();
                                if (errJson.detail) msg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
                            } catch (_) {}
                            throw new Error(msg);
                        }
                        showFeedback("You're subscribed! The Daily AI Digest will be delivered to your inbox.", false);
                    }

                    try {
                        const subs = JSON.parse(localStorage.getItem('as_subscribers') || '[]');
                        if (!subs.includes(email)) subs.push(email);
                        localStorage.setItem('as_subscribers', JSON.stringify(subs));
                        localStorage.setItem('as_newsletter_email', email);
                    } catch (e) { }

                    if (emailInput) emailInput.value = '';
                } catch (err) {
                    showFeedback(err.message || "We couldn't complete your subscription right now. Please try again.", true);
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnText) btnText.textContent = 'Subscribe';
                    if (btnSpinner) btnSpinner.style.display = 'none';
                }
            });
        }

        if (!hasModuleMain && modalForm && !modalForm.dataset.bound) {
            modalForm.dataset.bound = 'true';
            modalForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const name = modalName ? modalName.value.trim() : '';
                if (!name) {
                    if (modalName) {
                        modalName.classList.add('as-input-error');
                        modalName.focus();
                    }
                    showModalFeedback('Please enter your name.', true);
                    return;
                }

                const email = modalEmail ? modalEmail.value.trim() : '';
                if (!validateEmail(email)) {
                    if (modalEmail) {
                        modalEmail.classList.add('as-input-error');
                        modalEmail.focus();
                    }
                    showModalFeedback('Please enter a valid email address.', true);
                    return;
                }

                const freqInput = document.querySelector('input[name="as-frequency"]:checked');
                const frequency = freqInput ? freqInput.value : 'DAILY';
                const deliveryDay = (frequency === 'WEEKLY' && prefDay) ? prefDay.value : null;
                const deliveryTime = prefTime ? prefTime.value : '08:00 AM';
                const timezone = prefTimezone ? (prefTimezone.value.trim() || 'UTC') : 'UTC';

                const topicEls = document.querySelectorAll('input[name="topics"]:checked');
                const topics = Array.from(topicEls).map(el => el.value);

                const contentEls = document.querySelectorAll('input[name="content_types"]:checked');
                const contentTypes = Array.from(contentEls).map(el => el.value);

                const saveText = modalSaveBtn ? modalSaveBtn.querySelector('.as-save-text') : null;
                const saveSpinner = modalSaveBtn ? modalSaveBtn.querySelector('.as-save-spinner') : null;
                if (modalSaveBtn) modalSaveBtn.disabled = true;
                if (saveText) saveText.textContent = 'Saving...';
                if (saveSpinner) saveSpinner.style.display = 'inline-block';

                const payload = {
                    name,
                    email,
                    frequency,
                    delivery_day: deliveryDay,
                    delivery_time: deliveryTime,
                    timezone,
                    topics,
                    content_types: contentTypes,
                    preferred_channel: 'EMAIL'
                };

                try {
                    if (window.aiNewsApi && typeof window.aiNewsApi.subscribeToAINews === 'function') {
                        await window.aiNewsApi.subscribeToAINews({ email, name, frequency, preferred_channel: 'EMAIL', topics });
                    } else {
                        const apiUrl = (typeof window.buildApiUrl === 'function')
                            ? window.buildApiUrl('/newsletter/subscribe')
                            : ((window.__AI_NEWS_API_URL__ || '') + '/newsletter/subscribe');
                        const res = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({ email, name, frequency, preferred_channel: 'EMAIL', topics })
                        });
                        if (!res.ok) {
                            let msg = 'Could not save preferences (' + res.status + ')';
                            try {
                                const errJson = await res.json();
                                if (errJson.detail) msg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
                            } catch (_) {}
                            throw new Error(msg);
                        }
                    }

                    try {
                        localStorage.setItem('as_newsletter_preferences', JSON.stringify(payload));
                        localStorage.setItem('as_newsletter_email', email);
                        const subs = JSON.parse(localStorage.getItem('as_subscribers') || '[]');
                        if (!subs.includes(email)) subs.push(email);
                        localStorage.setItem('as_subscribers', JSON.stringify(subs));
                    } catch (lsErr) { }

                    if (emailInput) emailInput.value = email;

                    showModalFeedback('Preferences saved.', false);
                    setTimeout(closeModal, 1200);
                } catch (e) {
                    showModalFeedback(e.message || "We couldn't save your preferences right now. Please try again.", true);
                } finally {
                    if (modalSaveBtn) modalSaveBtn.disabled = false;
                    if (saveText) saveText.textContent = 'Save Preferences';
                    if (saveSpinner) saveSpinner.style.display = 'none';
                }
            });
        }
    }


    
    /* ================= 7. ON-PAGE PROJECT EVOLUTION CONTROLLER ================= */
/**
 * Project Architecture & Evolution Controller
 * Manages on-page interactive pipelines, v1-v4 ablation milestone switcher,
 * layman vs deep architecture toggles, and click-to-inspect stage node inspectors.
 */

const RAG_VERSIONS = {
    1: {
        id: 1,
        name: 'Version 01: Dense Baseline',
        badge: 'Baseline',
        headline: 'Dense Semantic Vector Search (Cosine Similarity Only)',
        metrics: 'Exact Recall: 0.0% • MRR@10: 0.0000',
        note: 'Complete retrieval omission on exact financial identifiers, fiscal years, and section numbers.',
        layman: '<strong>v1 (In Simple Words):</strong> We started with standard AI vector search (the way ChatGPT or typical tutorials do it). While it understood general ideas like "risk factors", it completely failed to find exact numbers, fiscal year tables (like FY2023), or specific SEC form identifiers because numbers and acronyms get blurred together in pure semantic vectors.',
        tech: '<strong>v1 Production Architecture:</strong> 384-dim dense bi-encoder embeddings stored in vector index. Relied strictly on cosine similarity top-k nearest neighbors. Zero lexical keyword indexing or table structure recognition, leading to a 0.0% exact recall on quantitative SEC 10-K benchmark test questions.',
        stages: [
            { num: '01', name: 'Raw Ingestion', sub: 'Standard Text Extraction', tech: 'pypdf', desc: 'Flattens PDF pages into unformatted string blobs, destroying multi-column tables and formatting boundaries.', input: 'SEC 10-K PDF files', output: 'Raw unformatted text blob' },
            { num: '02', name: 'Fixed Chunking', sub: 'Fixed Character Slicing', tech: 'CharacterSplitter (500 chars)', desc: 'Arbitrarily slices text every 500 characters, cutting numbers, tables, and sentence clauses in half.', input: 'Raw text blob', output: 'Arbitrary chunk slices' },
            { num: '03', name: 'Dense Embedding', sub: 'Single Bi-Encoder', tech: 'all-MiniLM-L6-v2', desc: 'Encodes chunks into 384-dimensional vectors. Blurs exact numeric codes into abstract semantic points.', input: 'Sliced text chunks', output: '384-dim dense vectors' },
            { num: '04', name: 'Vector Search', sub: 'Cosine Top-K', tech: 'Vector DB Index', desc: 'Queries nearest vectors via cosine distance. Fails to locate specific numeric metrics or balance sheet rows.', input: 'User query vector', output: 'Top-5 nearest semantic chunks' },
            { num: '05', name: 'Unchecked LLM', sub: 'Direct LLM Prompting', tech: 'Standard LLM', desc: 'Prompts the LLM with retrieved text. The LLM hallucinates calculations and makes up numbers.', input: 'Retrieved chunks + prompt', output: 'Hallucinated, unverified answer' }
        ]
    },
    2: {
        id: 2,
        name: 'Version 02: Sparse Lexical',
        badge: 'Lexical',
        headline: 'Sparse BM25 Keyword Search (Exact Token Matching)',
        metrics: 'Synonym Recall: 14.1% • Keyword Recall: 62.0%',
        note: 'Succeeded on exact financial tickers and codes, but failed on semantic concepts and synonyms.',
        layman: '<strong>v2 (In Simple Words):</strong> Next, we tried traditional keyword search (like Google in 2005) using BM25. This solved the problem with exact codes like "Form 10-K" or "EBITDA". However, if a user asked for "operating profit" and the report called it "operating earnings", BM25 found nothing because it does not understand meaning or synonyms.',
        tech: '<strong>v2 Production Architecture:</strong> BM25 Okapi inverted keyword index. Tokenized text with stemming and frequency inverse-document-frequency scoring. Solved exact alphanumeric queries, but dropped recall whenever query terminology deviated from document phrasing.',
        stages: [
            { num: '01', name: 'Token Ingestion', sub: 'Text Extraction & Cleaning', tech: 'PyMuPDF Text Extract', desc: 'Extracts document text with basic whitespace normalization and punctuation stripping.', input: 'SEC 10-K documents', output: 'Cleaned text stream' },
            { num: '02', name: 'Sentence Chunking', sub: 'Sentence Boundary Splitter', tech: 'NLTK Sentence Tokenizer', desc: 'Segments documents along sentence boundaries to preserve natural grammatical structure.', input: 'Text stream', output: 'Sentence-bounded chunks' },
            { num: '03', name: 'BM25 Inverted Index', sub: 'Term Frequency Index', tech: 'rank-bm25 Okapi', desc: 'Builds an inverted index mapping stemmed terms to document chunk IDs with frequency weights.', input: 'Tokenized chunks', output: 'Inverted lexical index' },
            { num: '04', name: 'BM25 Retrieval', sub: 'Lexical Score Top-K', tech: 'BM25 Scorer', desc: 'Scores chunks based on exact term matches. Satisifies exact code searches but misses synonyms.', input: 'Query keywords', output: 'Top-10 exact match chunks' },
            { num: '05', name: 'LLM Generation', sub: 'Context Augmented Prompt', tech: 'Google Gemini', desc: 'Generates answer from retrieved BM25 chunks. Still susceptible to arithmetic hallucinations.', input: 'BM25 chunks + prompt', output: 'Grounded text answer (math unverified)' }
        ]
    },
    3: {
        id: 3,
        name: 'Version 03: Hybrid RRF',
        badge: 'Breakthrough',
        headline: 'Hybrid Dense + Sparse Fusion via Reciprocal Rank Fusion (RRF)',
        metrics: 'Hybrid Recall@10: 71.4% • MRR@10: 0.6200',
        note: 'Combined meaning and keywords, but multi-page balance sheets were sliced and the LLM still made math errors.',
        layman: '<strong>v3 (In Simple Words):</strong> We merged the two engines together into a Hybrid system using Reciprocal Rank Fusion (RRF). This was a huge leap—jumping from 0% to 71.4% recall! But when analyzing multi-page financial tables, rows were still cut in half, and the AI was still guessing arithmetic like percentage growth rates.',
        tech: '<strong>v3 Production Architecture:</strong> Dual-channel retrieval engine executing Qdrant 768-dim dense similarity and BM25 Okapi lexical scoring concurrently. Merged using Reciprocal Rank Fusion (k=60). Jumped recall to 71.4%, but exposed vulnerability in table chunking and LLM arithmetic.',
        stages: [
            { num: '01', name: 'Document Ingestion', sub: 'PDF Extraction', tech: 'PyMuPDF Parser', desc: 'Parses PDF text streams into structured page buffers.', input: 'SEC 10-K documents', output: 'Page text buffers' },
            { num: '02', name: 'Window Chunking', sub: '500-Token Sliding Window', tech: 'Token Sliding Window', desc: 'Segments text into 500-token chunks with 50-token overlap.', input: 'Page text buffers', output: '500-token text chunks' },
            { num: '03', name: 'Dual Indexing', sub: 'Dense Qdrant + Sparse BM25', tech: 'Qdrant (768d) + BM25', desc: 'Indexes every chunk into both Qdrant HNSW and BM25 lexical structures.', input: 'Text chunks', output: 'Vector DB collection + BM25 Index' },
            { num: '04', name: 'Dual Retrieval', sub: 'Parallel Candidate Query', tech: 'Async Multi-Query', desc: 'Queries both engines in parallel for top-30 candidates each.', input: 'User query string', output: 'Top-30 Dense + Top-30 Sparse candidates' },
            { num: '05', name: 'RRF Fusion', sub: 'Rank Merger (k=60)', tech: 'RRF Rank Fusion', desc: 'Calculates reciprocal rank scores: SUM(1 / (60 + rank)) to merge both candidate lists.', input: 'Dual candidate lists', output: 'Top-10 fused candidate chunks' },
            { num: '06', name: 'LLM Synthesis', sub: 'Grounded Generation', tech: 'Google Gemini Pro', desc: 'Synthesizes answer from fused chunks. Better context, but math still prone to calculation drift.', input: 'Fused chunks + prompt', output: 'Answer with partial evidence' }
        ]
    },
    4: {
        id: 4,
        name: 'Version 04: Production Platform',
        badge: 'Production ★',
        headline: 'Full 10-Stage Enterprise Architecture with AST Math Engine & Table Reconstruction',
        metrics: 'Recall@10: 85.71% • MRR@10: 0.7738 • Math Accuracy: 100%',
        note: 'Complete enterprise document intelligence platform: table reconstruction, hybrid RRF, AST Python math coprocessor, and negative rejection.',
        layman: '<strong>v4 (In Simple Words):</strong> The production master platform. First, it identifies corporate tables and extracts them into structured formats so columns and rows are never cut. Second, it searches with both meaning and exact keywords. Third, whenever a question requires math (like calculating profit margins or growth rates), it runs actual Python code in a secure sandbox—guaranteeing 100% mathematical accuracy with verified page citations.',
        tech: '<strong>v4 Production Architecture:</strong> End-to-end 10-stage enterprise RAG platform. Employs layout-aware table reconstruction, contextual hierarchy chunking, parallel dense (Qdrant 768-dim) and sparse (BM25) search merged via RRF (k=60), syntactic query intent routing, a deterministic Python AST arithmetic engine for 100% calculation accuracy, grounded Gemini generation, and adversarial negative query rejection.',
        stages: [
            { num: '01', name: 'Document Ingestion', sub: 'PDFs, SEC 10-K, DOCX', tech: 'PyMuPDF • pdfplumber', desc: 'Ingests raw multi-page corporate filings, research papers, and reports. Cleans formatting artifacts and detects page boundaries.', input: 'Raw unstructured files (PDF, DOCX)', output: 'Normalized document streams with layout tags' },
            { num: '02', name: 'Table Reconstruction', sub: 'Preserves Row/Col Schema', tech: 'Custom Table Parser', desc: 'Identifies financial balance sheets and extracts them as structured Markdown/JSON tables, preventing sliced table context.', input: 'Multi-column raw page grids', output: 'Structured Markdown table objects' },
            { num: '03', name: 'Contextual Chunking', sub: '500-Token + Overlap', tech: 'Hierarchy Chunker', desc: 'Segments prose into 500-token contextual windows with 100-token overlap, attaching document title and section headers to chunk metadata.', input: 'Full parsed documents', output: 'Context-enriched chunk units with metadata' },
            { num: '04', name: 'Parallel Dual Indexing', sub: 'Dense & Sparse Streams', tech: 'Qdrant + BM25 Okapi', desc: 'Concurrently indexes every chunk into Qdrant (768-dim dense vectors via Sentence-Transformers) and BM25 (tokenized keyword index).', input: 'Enriched text chunks', output: 'Qdrant HNSW Collection + BM25 Lexical Index' },
            { num: '05', name: 'Query Intent Routing', sub: 'Math vs Synthesis Intent', tech: 'Syntactic Query Classifier', desc: 'Detects if the query is conceptual ("What are the risks?") or quantitative ("Calculate YoY operating margin growth rate").', input: 'User query string', output: 'Intent route: [ARITHMETIC_CALC] or [SEMANTIC_SYNTHESIS]' },
            { num: '06', name: 'Concurrent Retrieval', sub: 'Dense ANN + Keyword', tech: 'Async Execution Pool', desc: 'Dispatches parallel queries to Qdrant (top-50 semantic candidates) and BM25 (top-50 exact lexical match candidates).', input: 'Normalized query tokens', output: 'Top-50 Dense Candidates + Top-50 Sparse Candidates' },
            { num: '07', name: 'Reciprocal Rank Fusion', sub: 'RRF Algorithm (k=60)', tech: 'Mathematical Rank Merger', desc: 'Merges dense and sparse candidate rankings into an authoritative unified order using RRF(d) = SUM(1 / (60 + rank)).', input: 'Dual 50-candidate ranked lists', output: 'Top-10 Fused Context Candidates' },
            { num: '08', name: 'Deterministic Math AST', sub: 'Zero Hallucination Logic', tech: 'Python AST Coprocessor', desc: 'Extracts numeric values from verified table chunks and computes math deterministically in Python. The LLM never guesses math.', input: 'Extracted table metrics & math expression', output: '100% mathematically verified numeric answer' },
            { num: '09', name: 'Grounded Synthesis', sub: 'Citations & Evidence', tech: 'Google Gemini AI', desc: 'Synthesizes narrative responses anchored strictly to retrieved evidence with inline citations referencing source document and page numbers.', input: 'Top chunks + Grounding System Prompt', output: 'Narrative response with [Page X, Doc Y] citations' },
            { num: '10', name: 'Negative Query Defense', sub: 'Hallucination Rejection', tech: 'Confidence Guardrail', desc: 'Safely outputs a formal rejection instead of fabricating answers if retrieved evidence is insufficient for the query.', input: 'Draft answer + source confidence check', output: 'Verified final answer OR Safe rejection message' }
        ]
    }
};

const OTHER_PROJECTS = {
    'fastcloud': {
        key: 'fastcloud',
        title: 'FastCloud: AI-Powered Natural Language Cloud Automation Platform',
        layman: '<strong>What It Does (In Simple Words):</strong> Setting up cloud infrastructure on Amazon Web Services (AWS) or Microsoft Azure normally requires clicking through dozens of confusing technical screens. FastCloud lets developers type what they want in plain English (e.g. "Deploy a secure web server with a PostgreSQL database in Mumbai"), and the AI figures out the configuration, validates security rules, and deploys it safely across AWS or Azure with an automated undo (rollback) feature if anything fails.',
        tech: '<strong>Production Architecture:</strong> Multi-cloud automation runtime converting unstructured natural language into verified, dependency-ordered deployment execution graphs. Google Gemini extracts typed JSON specifications. A Directed Acyclic Graph (DAG) sequencing engine resolves resource dependencies (VPC -> Subnets -> Security Groups -> VMs) before dispatching asynchronous provisioning calls via official AWS SDK v3 and Azure SDKs, protected by transactional rollback hooks.',
        stages: [
            { num: '01', name: 'NL Prompt Ingestion', sub: 'Web Console & REST API', tech: 'Express.js Async Handler', desc: 'Accepts unstructured conversational deployment instructions from developers via web dashboard or API endpoints.', input: 'Natural language text prompt', output: 'Sanitized query payload' },
            { num: '02', name: 'Gemini Intent Parser', sub: 'Structured JSON Extraction', tech: 'Google Gemini API', desc: 'Extracts architectural intent, target cloud provider, regions, instance sizes, storage limits, and networking requirements.', input: 'Prompt text', output: 'Validated JSON deployment specification' },
            { num: '03', name: 'Policy & Quota Validator', sub: 'Pre-Flight Security Check', tech: 'Security Guardrail', desc: 'Validates user permissions, CIDR block allocations, and regional quota limits against AWS/Azure governance rules before execution.', input: 'JSON deployment specification', output: 'Approved execution plan or parameter error' },
            { num: '04', name: 'DAG Dependency Resolver', sub: 'Topological Sorter', tech: 'Directed Acyclic Graph', desc: 'Orders resource creation topologically (e.g. Virtual Private Cloud and Subnets must be provisioned before Virtual Machines).', input: 'Unordered resource list', output: 'Ordered multi-step execution graph' },
            { num: '05', name: 'Multi-Cloud SDK Engine', sub: 'AWS & Azure Dispatch', tech: 'AWS SDK v3 • Azure SDKs', desc: 'Dispatches authenticated, asynchronous infrastructure provisioning calls to target cloud providers with shared configuration contracts.', input: 'Ordered execution steps', output: 'Cloud provider task IDs & async promises' },
            { num: '06', name: 'Asynchronous Status Poller', sub: 'Lifecycle State Tracker', tech: 'Event-Driven Poller', desc: 'Polls cloud provider resource creation status in real-time, streaming status updates back to the client interface.', input: 'Provider task IDs', output: 'Real-time provisioning progress telemetry' },
            { num: '07', name: 'Transactional Rollback', sub: 'Fail-Safe De-provisioner', tech: 'Idempotency Engine', desc: 'If any downstream step fails during deployment, previously created resources are de-provisioned cleanly to avoid orphaned cloud expenses.', input: 'Error state trigger', output: 'Clean resource teardown & audit log' },
            { num: '08', name: 'AI Cloud Assistant', sub: 'Diagnostics & Telemetry', tech: 'Gemini Assistant • MongoDB', desc: 'Provides conversational architecture recommendations, cost optimization tips, and automated troubleshooting for failed deployments.', input: 'Deployment logs & user questions', output: 'Contextual diagnostics & optimization advice' }
        ]
    },
    'nexus-agent': {
        key: 'nexus-agent',
        title: 'Nexus AI Assistant: Custom Agent & MCP Platform',
        layman: '<strong>What It Does (In Simple Words):</strong> Most AI chatbots can only chat in a browser, but they cannot do anything on your computer. Nexus is an autonomous digital coworker: you can speak to it using your voice, and it can inspect code files on your computer, understand the codebase structure, pick the right tools, and execute complex programming and terminal tasks completely on its own using the new industry-standard Model Context Protocol.',
        tech: '<strong>Production Architecture:</strong> Lightweight, framework-free autonomous agent runtime built natively in Python without bloated agent orchestration libraries. Runs an explicit Thought -> Plan -> Tool Selection -> Execution -> Observation -> Self-Correction loop. Standardizes tool integration via FastMCP (Model Context Protocol), AST code analysis for repository comprehension, and low-latency voice streaming via Whisper & pyttsx3.',
        stages: [
            { num: '01', name: 'Multimodal Input Ingest', sub: 'Voice & Text Handlers', tech: 'SpeechRecognition • WebRTC', desc: 'Ingests user instructions via microphone or terminal. Handles ambient noise calibration and continuous speech-to-text transcription.', input: 'Microphone audio stream or text prompt', output: 'Transcribed user command' },
            { num: '02', name: 'Autonomous Task Planner', sub: 'Thought-Plan-Act Cycle', tech: 'Google Gemini Reasoning', desc: 'Decomposes complex ambiguous goals into a sequence of ordered, executable sub-tasks with explicit success criteria.', input: 'User command', output: 'Multi-step action plan' },
            { num: '03', name: 'FastMCP Tool Discovery', sub: 'Standardized Handshake', tech: 'FastMCP / Model Context Protocol', desc: 'Dynamically connects to local and remote MCP tool servers to discover available tools, argument schemas, and execution boundaries.', input: 'Connected MCP endpoints', output: 'Validated tool registry & function schemas' },
            { num: '04', name: 'AST Codebase Scanner', sub: 'Symbol Hierarchy Tree', tech: 'Python AST Module', desc: 'Traverses local project directories and builds an abstract syntax tree representation of functions, classes, and import relationships.', input: 'Local directory path', output: 'Structural symbol map & contextual slices' },
            { num: '05', name: 'Sandboxed Tool Execution', sub: 'Filesystem & Shell', tech: 'Deterministic Tool Runner', desc: 'Executes filesystem edits, shell commands, and API requests safely within a controlled permission boundary.', input: 'Tool name + validated arguments', output: 'Raw tool stdout, stderr, or JSON result' },
            { num: '06', name: 'Observation & Reflection', sub: 'Autonomous Self-Correction', tech: 'Agentic Feedback Loop', desc: 'Inspects execution results; if a tool call fails or tests fail, the agent diagnoses the error and refines its approach autonomously.', input: 'Tool execution output', output: 'Self-corrected plan or task completion signal' },
            { num: '07', name: 'Episodic Memory Store', sub: 'Context Retention', tech: 'In-Memory State Tree', desc: 'Maintains execution history, tool states, and observations across multi-turn sessions for persistent contextual continuity.', input: 'Session trace events', output: 'Context-enriched memory window' },
            { num: '08', name: 'Neural Speech Output', sub: 'Hands-Free Synthesis', tech: 'pyttsx3 Neural TTS', desc: 'Synthesizes conversational voice feedback locally with minimal latency for hands-free interactive developer workflows.', input: 'Final synthesized answer text', output: 'Low-latency spoken audio stream' }
        ]
    },
    'ai-news': {
        key: 'ai-news',
        title: 'AI News Intelligence & Synthesis Platform',
        layman: '<strong>What It Does (In Simple Words):</strong> Instead of an engineer spending hours browsing dozens of tech websites, Twitter/X feeds, and research archives every morning, this autonomous platform reads over 1,300 AI articles, spots when multiple media outlets are reporting on the exact same research paper, merges duplicate stories, objectively ranks the top 5 breakthroughs, and emails an executive 2-minute digest directly to your inbox.',
        tech: '<strong>Production Architecture:</strong> Asynchronous multi-worker data ingestion, deduplication, and synthesis pipeline. Sweeps 8+ continuous streams, normalizes metadata, and generates 1536-dim Gemini embeddings. Employs PostgreSQL 18 with native C-compiled pgvector 0.8.6 for zero-overhead in-database cosine distance (<=>) deduplication. Computes transparent 6-signal composite scores and dispatches automated newsletters.',
        stages: [
            { num: '01', name: 'Multi-Source Sweeper', sub: 'ArXiv, HN, RSS, YouTube', tech: 'Feedparser • YouTube API', desc: 'Continuously sweeps 8+ authoritative sources across official research repos, community discussions, and tech journalism.', input: 'Raw RSS feeds, JSON endpoints, video transcripts', output: 'Raw unparsed content payloads' },
            { num: '02', name: 'Content Normalization', sub: 'Canonical URLs & Hashes', tech: 'Pydantic v2 Models', desc: 'Extracts author metadata, publication dates, canonical URLs, and computes SHA-256 content hashes to reject duplicate URLs instantly.', input: 'Raw content payloads', output: 'Sanitized ContentItem records' },
            { num: '03', name: 'Semantic Embeddings', sub: '1536-dim Vector Space', tech: 'Google Gemini Embeddings', desc: 'Generates dense vector representations capturing fine-grained technical meaning, architecture names, and research concepts.', input: 'Normalized title & body text', output: '1536-dimensional floating point vectors' },
            { num: '04', name: 'pgvector Deduplication', sub: 'Cosine Distance (<=>)', tech: 'PostgreSQL 18 + pgvector 0.8.6', desc: 'Executes native C-extension vector similarity directly inside the database, detecting semantically duplicate reporting with zero network latency.', input: 'New vector embeddings', output: 'Cosine similarity matrix & duplicate cluster links' },
            { num: '05', name: 'Story Clustering Engine', sub: 'Multi-Source Synthesis', tech: 'Agglomerative Clusterer', desc: 'Aggregates individual articles, papers, and community posts covering the exact same development into a single authoritative master story.', input: 'Clustered content items', output: 'Unified Story records with source citations' },
            { num: '06', name: '6-Signal Ranking', sub: 'Transparent Scoring', tech: 'Deterministic Scorer', desc: 'Evaluates each story objectively: Recency (25%), Relevance (25%), Authority (20%), Coverage (15%), Engagement (10%), and Format Diversity (5%).', input: 'Story clusters + metadata signals', output: 'Deterministic ranking score (0-100)' },
            { num: '07', name: 'Editorial Diversity Filter', sub: 'Anti-Monopoly Caps', tech: 'Curation Guardrail', desc: 'Applies source and topic caps to ensure no single corporate entity or topic dominates the daily digest, ensuring balanced technical coverage.', input: 'Ranked story candidates', output: 'Balanced top-10 curated digest feed' },
            { num: '08', name: 'Automated Dispatch & API', sub: 'Resend API + FastAPI', tech: 'FastAPI • Jinja2 • Resend', desc: 'Renders responsive HTML newsletters sent to active subscribers on schedule, while serving high-speed JSON endpoints for live web display.', input: 'Curated stories + subscriber preferences', output: 'Delivered email briefings & REST JSON feeds' }
        ]
    }
};

let currentRagVersion = 4;
let projectModes = {
    'nexus-rag': 'tech',
    'fastcloud': 'tech',
    'nexus-agent': 'tech',
    'ai-news': 'tech'
};

function selectRagVersion(versionNum) {
    currentRagVersion = versionNum;
    const vData = RAG_VERSIONS[versionNum];
    if (!vData) return;

    // 1. Update version tabs
    for (let i = 1; i <= 4; i++) {
        const tab = document.getElementById(`tab-rag-v${i}`);
        if (tab) {
            if (i === versionNum) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        }
    }

    // 2. Update headline and note
    const headlineEl = document.getElementById('rag-version-headline');
    if (headlineEl) headlineEl.textContent = vData.headline;

    const metricsEl = document.getElementById('rag-version-metrics');
    if (metricsEl) metricsEl.textContent = vData.metrics;

    const noteEl = document.getElementById('rag-version-note');
    if (noteEl) noteEl.textContent = vData.note;

    // 3. Update explanation box
    updateRagExplanation();

    // 4. Render stages grid
    renderStagesGrid('nexus-rag', vData.stages);

    // 5. Inspect first stage
    inspectProjectStage('nexus-rag', 0);
}

function updateRagExplanation() {
    const box = document.getElementById('rag-explanation-box');
    if (!box) return;
    const vData = RAG_VERSIONS[currentRagVersion];
    const isLayman = projectModes['nexus-rag'] === 'layman';
    box.innerHTML = isLayman ? vData.layman : vData.tech;
}

function toggleProjectExplanation(projectKey) {
    const currentMode = projectModes[projectKey] || 'tech';
    const newMode = currentMode === 'tech' ? 'layman' : 'tech';
    projectModes[projectKey] = newMode;

    const btn = document.getElementById(`btn-toggle-${projectKey}`);
    const isLayman = newMode === 'layman';

    if (btn) {
        btn.innerHTML = isLayman
            ? '<span class="as-view-icon">⚙️</span><span>Deep Technical View</span>'
            : '<span class="as-view-icon">👔</span><span>Plain English View</span>';
        btn.setAttribute('title', isLayman ? 'Switch to Deep Technical View' : 'Switch to Plain English View');
    }

    if (projectKey === 'nexus-rag') {
        updateRagExplanation();
    } else {
        const box = document.getElementById(`${projectKey}-explanation-box`);
        const pData = OTHER_PROJECTS[projectKey];
        if (box && pData) {
            box.innerHTML = isLayman ? pData.layman : pData.tech;
        }
    }
}

function inspectProjectStage(projectKey, stageIndex) {
    let stages = [];
    if (projectKey === 'nexus-rag') {
        stages = RAG_VERSIONS[currentRagVersion].stages;
    } else if (OTHER_PROJECTS[projectKey]) {
        stages = OTHER_PROJECTS[projectKey].stages;
    }

    const stage = stages[stageIndex];
    if (!stage) return;

    // Highlight active stage node
    const container = document.getElementById(`${projectKey}-pipeline-grid`);
    if (container) {
        const nodes = container.querySelectorAll('.as-stage-card');
        nodes.forEach((n, idx) => {
            if (idx === stageIndex) {
                n.classList.add('active');
            } else {
                n.classList.remove('active');
            }
        });
    }

    // Update inspector content
    const numEl = document.getElementById(`${projectKey}-inspect-num`);
    const titleEl = document.getElementById(`${projectKey}-inspect-title`);
    const techEl = document.getElementById(`${projectKey}-inspect-tech`);
    const descEl = document.getElementById(`${projectKey}-inspect-desc`);
    const inputEl = document.getElementById(`${projectKey}-inspect-input`);
    const outputEl = document.getElementById(`${projectKey}-inspect-output`);

    if (numEl) numEl.textContent = `STAGE ${stage.num}`;
    if (titleEl) titleEl.textContent = `${stage.name} (${stage.sub})`;
    if (techEl) techEl.textContent = stage.tech;
    if (descEl) descEl.textContent = stage.desc;
    if (inputEl) inputEl.textContent = stage.input;
    if (outputEl) outputEl.textContent = stage.output;
}

function renderStagesGrid(projectKey, stages) {
    const container = document.getElementById(`${projectKey}-pipeline-grid`);
    if (!container) return;

    container.innerHTML = stages.map((st, idx) => `
        <button type="button" class="as-stage-card ${idx === 0 ? 'active' : ''}" onclick="inspectProjectStage('${projectKey}', ${idx})">
            <div class="as-stage-header">
                <span class="as-stage-badge">${st.num}</span>
                <span class="as-stage-tech-mini">${st.tech.split('•')[0].trim()}</span>
            </div>
            <div class="as-stage-title">${st.name}</div>
            <div class="as-stage-sub">${st.sub}</div>
        </button>
    `).join('');
}

function initProjectEvolution() {
    // 1. Initialize NEXUS RAG with v4
    selectRagVersion(4);

    // 2. Initialize other 3 projects
    Object.keys(OTHER_PROJECTS).forEach(key => {
        const pData = OTHER_PROJECTS[key];
        const box = document.getElementById(`${key}-explanation-box`);
        if (box) {
            box.innerHTML = pData.tech;
        }
        renderStagesGrid(key, pData.stages);
        inspectProjectStage(key, 0);
    });
}

// Auto-bind to window for inline onclick handlers
if (typeof window !== 'undefined') {
    window.selectRagVersion = selectRagVersion;
    window.toggleProjectExplanation = toggleProjectExplanation;
    window.inspectProjectStage = inspectProjectStage;
    window.initProjectEvolution = initProjectEvolution;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectEvolution);
    } else {
        initProjectEvolution();
    }
}


    /* ================= 7B. FASTCLOUD SLIDESHOW ================= */
    const FASTCLOUD_SLIDES = [
        { index: 0, stage: 'STAGE 01: NATURAL LANGUAGE INGESTION', title: 'Infrastructure as Prompt: Conversational Cloud Entry', explanation: 'Enables developers to describe complex multi-tier cloud environments in plain English instead of writing hundreds of lines of Terraform or navigating dozens of AWS/Azure console screens.' },
        { index: 1, stage: 'STAGE 02: VISUAL BLACKBOARD & TOPOLOGY', title: 'Architecture Studio: Visual Multi-Cloud Blackboard', explanation: 'Interactive design canvas with an official cloud component palette (VMs, VNets, Subnets, NSGs, Gateways). Allows developers to visually connect and model multi-cloud topologies before provisioning.' },
        { index: 2, stage: 'STAGE 03: CLOUD SHELL & DUAL DISPATCH', title: 'Multi-Cloud Workspace & Cloud Shell Deployment CLI', explanation: 'Multi-cloud execution runtime supporting active Azure ARM and AWS credentials, paired with an integrated interactive Cloud Shell for direct CLI command execution and deployment management.' },
        { index: 3, stage: 'STAGE 04: OPERATIONAL VISIBILITY & TELEMETRY', title: 'Operational Workspace Dashboard & Multi-Cloud Health', explanation: 'Unified operational dashboard showing active resources, provisioning health checks, deployment telemetry, and status cards across both AWS and Azure in one consolidated viewport.' },
        { index: 4, stage: 'STAGE 05: CONVERSATIONAL CLOUD COPILOT', title: 'Conversational Cloud Copilot: AI Cloud Engineer', explanation: 'Dedicated cloud copilot engineered exclusively for cloud architecture questions: recommends low-cost VM options, optimizes subnet routing, and provides live troubleshooting diagnostics.' }
    ];

    function initFastCloudSlideshow() {
        const container = document.getElementById('fastcloud-gallery');
        if (!container || container.dataset.slideshowBound) return;
        container.dataset.slideshowBound = 'true';

        let currentIndex = 0;
        const totalSlides = FASTCLOUD_SLIDES.length;
        const slides = container.querySelectorAll('.as-slide');
        const tabs = container.querySelectorAll('.as-slide-tab');
        const dots = container.querySelectorAll('.as-slide-dot');
        const prevBtn = document.getElementById('fc-slide-prev');
        const nextBtn = document.getElementById('fc-slide-next');
        const counter = document.getElementById('fc-slide-counter');
        const stageBadge = document.getElementById('fc-caption-stage');
        const captionTitle = document.getElementById('fc-caption-title');
        const captionBody = document.getElementById('fc-caption-body');

        function showSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            const data = FASTCLOUD_SLIDES[currentIndex];

            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentIndex));
            tabs.forEach((tab, i) => {
                tab.classList.toggle('is-active', i === currentIndex);
                tab.setAttribute('aria-selected', String(i === currentIndex));
            });
            dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));

            if (counter) counter.textContent = `Slide ${currentIndex + 1} / ${totalSlides}`;
            if (stageBadge) stageBadge.textContent = data.stage;
            if (captionTitle) captionTitle.textContent = data.title;
            if (captionBody) captionBody.textContent = data.explanation;
        }

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const idx = parseInt(tab.dataset.slideIndex, 10);
                if (!isNaN(idx)) showSlide(idx);
            });
        });
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.index, 10);
                if (!isNaN(idx)) showSlide(idx);
            });
        });
        if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(currentIndex - 1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(currentIndex + 1); }
        });
        if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '0');
        showSlide(0);
    }

    /* ================= 8. INITIALIZATION & GLOBAL DELEGATION ================= */
    function init() {
        new AmbientAIBackground();
        initNavbar();
        initCopyEmail();
        initNewsletter();
        initFastCloudSlideshow();
        if (typeof initProjectEvolution === "function") initProjectEvolution();

        // Global delegation for modal open / close
        document.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('[data-arch-target], [data-project]');
            if (targetBtn) {
                e.preventDefault();
                const key = targetBtn.getAttribute('data-arch-target') || targetBtn.getAttribute('data-project');
                openArchModal(key);
            }

            const closeBtn = e.target.closest('#as-arch-modal-close');
            if (closeBtn) {
                e.preventDefault();
                closeArchModal();
            }

            const backdrop = document.getElementById('as-arch-modal-backdrop');
            if (e.target === backdrop) {
                closeArchModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeArchModal();
        });

        const closeBtn = document.getElementById('as-arch-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeArchModal);
        }

        // Prevent wheel leak on architecture modal box
        const modalBox = document.querySelector('.as-arch-modal-box');
        if (modalBox && !modalBox.__wheelBound) {
            modalBox.__wheelBound = true;
            modalBox.addEventListener('wheel', (e) => {
                const { scrollTop, scrollHeight, clientHeight } = modalBox;
                const delta = e.deltaY;
                const isScrollingDown = delta > 0;
                const isScrollingUp = delta < 0;

                if (isScrollingDown && (scrollTop + clientHeight >= scrollHeight - 2)) {
                    e.preventDefault();
                } else if (isScrollingUp && scrollTop <= 0) {
                    e.preventDefault();
                }
            }, { passive: false });
        }

        const archBackdrop = document.getElementById('as-arch-modal-backdrop');
        if (archBackdrop && !archBackdrop.__wheelBound) {
            archBackdrop.__wheelBound = true;
            archBackdrop.addEventListener('wheel', (e) => {
                if (e.target === archBackdrop) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
