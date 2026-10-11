/**
 * AI News Intelligence Platform - Interactive Controller
 * Connects directly to live FastAPI backend at http://127.0.0.1:8000/api/v1
 */

import { aiNewsApi } from '../core/api-client.js';

class AiNewsProjectController {
    constructor() {
        this.overview = null;
        this.stories = [];
        this.rawItems = [];
        this.rawPage = 1;
        this.rawTotalPages = 1;
        this.activeTopic = 'ALL';
        this.activeContentType = null;
        this.searchQuery = '';
        this.activeView = 'curated'; // 'curated' | 'raw'
    }

    async init() {
        this.bindEvents();
        await this.loadOverview();
        await this.loadCuratedStories();
    }

    bindEvents() {
        // Search Input
        const searchInput = document.getElementById('as-news-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderStories();
            });
        }

        // View Mode Toggles (Curated vs Raw)
        const viewCuratedBtn = document.getElementById('as-view-curated-btn');
        const viewRawBtn = document.getElementById('as-view-raw-btn');
        if (viewCuratedBtn && viewRawBtn) {
            viewCuratedBtn.addEventListener('click', () => this.switchView('curated'));
            viewRawBtn.addEventListener('click', () => this.switchView('raw'));
        }

        // Filter Pills
        const filterContainer = document.getElementById('as-filter-tabs');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.as-tab-btn');
                if (!btn) return;

                filterContainer.querySelectorAll('.as-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                this.activeTopic = btn.dataset.topic || 'ALL';
                this.activeContentType = btn.dataset.type || null;
                this.renderStories();
            });
        }

        // Modal Close
        const modalBackdrop = document.getElementById('as-ranking-modal');
        const modalClose = document.getElementById('as-modal-close');
        if (modalClose && modalBackdrop) {
            modalClose.addEventListener('click', () => this.closeModal());
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) this.closeModal();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeModal();
            });
        }

        // Pipeline Flow Interactive Steps
        const pipelineSteps = document.querySelectorAll('.as-pipeline-step');
        pipelineSteps.forEach(step => {
            step.addEventListener('click', () => {
                pipelineSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                this.updatePipelineInspector(step.dataset.step);
            });
        });
    }

    async loadOverview() {
        const liveBadge = document.getElementById('as-live-badge-status');
        const pulseDot = document.getElementById('as-pulse-dot');
        const countItems = document.getElementById('as-kpi-items');
        const countStories = document.getElementById('as-kpi-stories');
        const countSources = document.getElementById('as-kpi-sources');
        const countDim = document.getElementById('as-kpi-dim');

        try {
            this.overview = await aiNewsApi.getOverview();

            if (liveBadge) liveBadge.textContent = 'LIVE BACKEND CONNECTED';
            if (pulseDot) pulseDot.classList.remove('offline');

            if (countItems) this.animateNumber(countItems, this.overview.total_content_items);
            if (countStories) this.animateNumber(countStories, this.overview.total_stories);
            if (countSources) this.animateNumber(countSources, this.overview.active_sources);
            if (countDim) countDim.textContent = `${this.overview.embedding_dimensions}-dim`;

            const subItems = document.getElementById('as-kpi-items-sub');
            if (subItems && this.overview.content_type_distribution) {
                const d = this.overview.content_type_distribution;
                subItems.textContent = `${d.ARTICLE || 0} Articles • ${d.RESEARCH_PAPER || 0} Papers • ${d.COMMUNITY_POST || 0} Posts`;
            }
        } catch (err) {
            console.error('Failed to load overview:', err);
            if (liveBadge) liveBadge.textContent = 'OFFLINE / STANDALONE';
            if (pulseDot) pulseDot.classList.add('offline');
            if (countItems) countItems.textContent = '1,348';
            if (countStories) countStories.textContent = '4';
            if (countSources) countSources.textContent = '8';
            if (countDim) countDim.textContent = '1536-dim';
        }
    }

    async loadCuratedStories() {
        const grid = document.getElementById('as-stories-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="as-story-card as-skeleton" style="height: 280px;"></div>
            <div class="as-story-card as-skeleton" style="height: 280px;"></div>
            <div class="as-story-card as-skeleton" style="height: 280px;"></div>
        `;

        try {
            this.stories = await aiNewsApi.getCuratedStories({ limit: 50 });
            this.renderStories();
        } catch (err) {
            console.error('Failed to fetch curated stories:', err);
            const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            const subtext = isLocal
                ? 'Start the local backend on port 8000: <code>uvicorn app.main:app --port 8000</code>'
                : 'Could not connect to live backend. If the Render service is waking from cold sleep, please wait 30 seconds and retry.';
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 12px;">
                    <h4 style="color: #f87171; margin-bottom: 0.5rem;">AI News Backend Not Reachable</h4>
                    <p style="color: var(--as-color-text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                        ${subtext}
                    </p>
                    <button id="as-btn-retry" class="as-tab-btn active" style="margin: 0 auto;">Retry Connection</button>
                </div>
            `;
            const retryBtn = document.getElementById('as-btn-retry');
            if (retryBtn) retryBtn.addEventListener('click', () => this.init());
        }
    }

    renderStories() {
        const grid = document.getElementById('as-stories-grid');
        if (!grid) return;

        let filtered = this.stories.filter(story => {
            // Topic filter
            if (this.activeTopic !== 'ALL') {
                const storyCat = (story.category || '').toLowerCase();
                const storyTopics = (story.topics || []).map(t => t.toLowerCase());
                const target = this.activeTopic.toLowerCase();
                const matchesTopic = storyCat.includes(target) || storyTopics.some(t => t.includes(target));
                if (!matchesTopic) return false;
            }

            // Content Type filter
            if (this.activeContentType && story.content_type !== this.activeContentType) {
                return false;
            }

            // Search query
            if (this.searchQuery) {
                const text = `${story.title} ${story.summary || ''} ${story.key_takeaway || ''}`.toLowerCase();
                if (!text.includes(this.searchQuery)) return false;
            }

            return true;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center; color: var(--as-color-text-secondary);">
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No stories matching current filters.</p>
                    <p style="font-size: 0.85rem;">Try clearing your search query or selecting "All Stories".</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(story => this.createStoryCardHtml(story)).join('');

        // Attach event listeners for ranking inspection
        grid.querySelectorAll('.as-btn-ranking').forEach(btn => {
            btn.addEventListener('click', () => {
                const storyId = btn.dataset.storyId;
                this.openRankingModal(storyId);
            });
        });
    }

    createStoryCardHtml(story) {
        const scorePercent = Math.round((story.ranking_score || 0) * 100);
        const sourceName = story.primary_source_name || 'Verified AI Source';
        const pubDate = story.published_at ? new Date(story.published_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) : 'Recent';

        const takeawayHtml = story.key_takeaway ? `
            <div class="as-story-callouts">
                <div class="as-callout-takeaway">⚡ ${this.escapeHtml(story.key_takeaway)}</div>
                ${story.why_it_matters ? `<div class="as-callout-why">📌 ${this.escapeHtml(story.why_it_matters)}</div>` : ''}
            </div>
        ` : '';

        const tagsHtml = (story.topics || [story.category || 'AI'])
            .slice(0, 3)
            .map(t => `<span class="as-tech-pill">${this.escapeHtml(t)}</span>`)
            .join(' ');

        return `
            <article class="as-story-card" data-id="${story.story_id}">
                <div>
                    <div class="as-story-meta-top">
                        <span class="as-story-source">
                            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--as-color-accent);"></span>
                            ${this.escapeHtml(sourceName)}
                        </span>
                        <span class="as-story-type">${this.escapeHtml(story.content_type || 'ARTICLE')} • ${pubDate}</span>
                    </div>

                    <h4 class="as-story-title">${this.escapeHtml(story.title)}</h4>

                    <div style="margin-bottom: 0.85rem;">
                        ${tagsHtml}
                    </div>

                    <p class="as-story-summary">${this.escapeHtml(story.summary || 'No summary available.')}</p>

                    ${takeawayHtml}
                </div>

                <div class="as-story-footer">
                    <div class="as-score-badge">
                        <span class="as-score-pill">Rank: ${scorePercent}%</span>
                        <span style="font-size:0.75rem;color:var(--as-color-text-secondary);">${story.article_count} source${story.article_count > 1 ? 's' : ''}</span>
                    </div>

                    <div class="as-story-actions">
                        <button class="as-btn-ranking" data-story-id="${story.story_id}" title="Inspect transparent mathematical scoring breakdown">
                            Signals 📊
                        </button>
                        ${story.canonical_url ? `
                            <a href="${story.canonical_url}" target="_blank" rel="noopener noreferrer" class="as-btn-source">
                                Source ↗
                            </a>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
    }

    async openRankingModal(storyId) {
        const modal = document.getElementById('as-ranking-modal');
        const modalBody = document.getElementById('as-ranking-modal-body');
        const modalTitle = document.getElementById('as-modal-story-title');
        if (!modal || !modalBody) return;

        modalTitle.textContent = 'Calculating Signal Breakdown...';
        modalBody.innerHTML = '<div style="padding: 2rem; text-align: center;">Fetching transparent signals from backend...</div>';
        modal.classList.add('open');

        try {
            const data = await aiNewsApi.getStoryRanking(storyId);
            modalTitle.textContent = data.headline;

            const totalScorePct = Math.round(data.total_score * 100);
            const signals = data.signals || {};

            const signalConfig = [
                { key: 'recency', label: 'Recency & Velocity', weight: '25%', desc: 'Exponential half-life decay (48h baseline)' },
                { key: 'relevance', label: 'AI Relevance Score', weight: '25%', desc: 'Gemini domain relevance model assessment' },
                { key: 'authority', label: 'Source Authority', weight: '20%', desc: 'Domain authority weighting across verified publishers' },
                { key: 'coverage', label: 'Multi-Source Corroboration', weight: '15%', desc: 'Independent verification across distinct outlets' },
                { key: 'engagement', label: 'Community Engagement', weight: '10%', desc: 'Log-scaled discussion comments, upvotes, and metrics' },
                { key: 'diversity', label: 'Format Diversity', weight: '5%', desc: 'Cross-format multi-modality (papers, videos, articles)' }
            ];

            const rowsHtml = signalConfig.map(cfg => {
                const s = signals[cfg.key] || { normalized_value: 0, raw_value: 0, weight: 0, weighted_score: 0 };
                const pct = Math.round((s.normalized_value || 0) * 100);
                const weightedPct = ((s.weighted_score || 0) * 100).toFixed(1);

                return `
                    <div class="as-signal-bar-wrap">
                        <div class="as-signal-header">
                            <span class="as-signal-name">${cfg.label} <span style="color:var(--as-color-text-secondary);font-size:0.75rem;">(Weight: ${cfg.weight})</span></span>
                            <span class="as-signal-metrics">Norm: <strong>${(s.normalized_value || 0).toFixed(2)}</strong> | Contrib: <strong>+${weightedPct}%</strong></span>
                        </div>
                        <div class="as-progress-track">
                            <div class="as-progress-fill" style="width: ${pct}%;"></div>
                        </div>
                        <div class="as-signal-formula">${cfg.desc} • Raw: ${s.raw_value !== undefined ? s.raw_value : 'N/A'}</div>
                    </div>
                `;
            }).join('');

            modalBody.innerHTML = `
                <div style="background: rgba(76,201,240,0.08); border: 1px solid rgba(76,201,240,0.25); border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--as-color-text-secondary); letter-spacing: 0.05em;">Final Deterministic Ranking Score</div>
                        <div style="font-size: 1.75rem; font-weight: 800; color: var(--as-color-accent);">${(data.total_score || 0).toFixed(4)} <span style="font-size: 1rem; color: var(--as-color-text-primary);">(${totalScorePct} / 100)</span></div>
                    </div>
                    <div style="text-align: right; font-size: 0.8rem; color: var(--as-color-text-secondary);">
                        <div>Weights Sum: <strong>${data.weights_sum || 1.0}</strong></div>
                        <div>Evaluated: <strong>${new Date(data.evaluated_at).toLocaleTimeString()}</strong></div>
                    </div>
                </div>

                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--as-color-text-primary); margin-bottom: 1rem;">
                    Objective 6-Signal Decomposition
                </h4>

                ${rowsHtml}
            `;
        } catch (err) {
            console.error('Failed to load ranking breakdown:', err);
            modalBody.innerHTML = `
                <div style="padding: 1.5rem; color: #f87171;">
                    Failed to fetch ranking breakdown: ${err.message}
                </div>
            `;
        }
    }

    closeModal() {
        const modal = document.getElementById('as-ranking-modal');
        if (modal) modal.classList.remove('open');
    }

    async switchView(view) {
        this.activeView = view;
        const viewCuratedBtn = document.getElementById('as-view-curated-btn');
        const viewRawBtn = document.getElementById('as-view-raw-btn');
        const curatedSection = document.getElementById('as-curated-feed-section');
        const rawSection = document.getElementById('as-raw-stream-section');

        if (view === 'curated') {
            viewCuratedBtn.classList.add('active');
            viewRawBtn.classList.remove('active');
            curatedSection.style.display = 'block';
            rawSection.style.display = 'none';
        } else {
            viewRawBtn.classList.add('active');
            viewCuratedBtn.classList.remove('active');
            curatedSection.style.display = 'none';
            rawSection.style.display = 'block';
            if (this.rawItems.length === 0) {
                await this.loadRawContent(1);
            }
        }
    }

    async loadRawContent(page = 1) {
        const tbody = document.getElementById('as-raw-tbody');
        const pageInfo = document.getElementById('as-raw-page-info');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;">Loading raw ingested items from PostgreSQL...</td></tr>';

        try {
            const data = await aiNewsApi.getContentItems({ page, pageSize: 12 });
            this.rawItems = data.items || [];
            this.rawPage = data.page;
            this.rawTotalPages = data.total_pages;

            if (pageInfo) pageInfo.textContent = `Page ${data.page} of ${data.total_pages} (${data.total.toLocaleString()} items total)`;

            tbody.innerHTML = this.rawItems.map(it => {
                const date = it.published_at ? new Date(it.published_at).toLocaleDateString() : 'N/A';
                return `
                    <tr>
                        <td style="font-weight:600;max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            <a href="${it.canonical_url}" target="_blank" rel="noopener noreferrer" style="color:var(--as-color-text-primary);text-decoration:none;">
                                ${this.escapeHtml(it.title)}
                            </a>
                        </td>
                        <td><span class="as-tech-pill">${this.escapeHtml(it.source_name || 'Source')}</span></td>
                        <td><span style="font-size:0.75rem;text-transform:uppercase;color:var(--as-color-accent);">${it.content_type}</span></td>
                        <td>${date}</td>
                        <td><span style="color:#34d399;font-weight:700;">${((it.ai_relevance_score || 0) * 100).toFixed(0)}%</span></td>
                    </tr>
                `;
            }).join('');

            // Bind pagination buttons
            const prevBtn = document.getElementById('as-raw-prev');
            const nextBtn = document.getElementById('as-raw-next');
            if (prevBtn) {
                prevBtn.disabled = this.rawPage <= 1;
                prevBtn.onclick = () => this.loadRawContent(this.rawPage - 1);
            }
            if (nextBtn) {
                nextBtn.disabled = this.rawPage >= this.rawTotalPages;
                nextBtn.onclick = () => this.loadRawContent(this.rawPage + 1);
            }
        } catch (err) {
            console.error('Failed to load raw content:', err);
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#f87171;padding:2rem;">Failed to load items: ${err.message}</td></tr>`;
        }
    }

    updatePipelineInspector(stepNum) {
        const inspector = document.getElementById('as-pipeline-inspector');
        if (!inspector) return;

        const info = {
            '1': {
                title: 'Stage 1: Multi-Source Heterogeneous Ingestion',
                tech: 'Feedparser • ArXiv API • Hacker News Firebase REST • YouTube v3 API',
                desc: 'Continuous ingestion engine periodically sweeps 8 configured sources across official research repositories, community discussions, and top-tier tech journalism. Raw payloads are normalized into uniform ContentItem records with canonical URLs, deduplication hashes, and structured metadata.'
            },
            '2': {
                title: 'Stage 2: Gemini AI Analysis & 1536-dim Embedding',
                tech: 'Google Gemini 1.5/2.0 • text-embedding-004 (1536d) • Fallback Resilience',
                desc: 'Incoming items are analyzed by Google Gemini to extract factual summaries, key takeaways, why-it-matters statements, relevance scores, and topics. Gemini generates 1536-dimensional semantic vector embeddings stored in PostgreSQL native vector columns.'
            },
            '3': {
                title: 'Stage 3: PostgreSQL 18 + pgvector Cosine Deduplication',
                tech: 'PostgreSQL 18.4 • Native pgvector 0.8.6 • Cosine Distance Operator (<=>)',
                desc: 'Computes exact cosine similarity in SQL using native vector operators: similarity = 1 - (embedding <=> target_vector). Exact duplicates (>= 0.95) are flagged; near-duplicates (>= 0.85 within 72 hours) are linked, preserving all 1,348 items without data loss.'
            },
            '4': {
                title: 'Stage 4: Multi-Signal Story Clustering & Synthesis',
                tech: 'Graph-based Clustering • Deterministic Canonical Selection • Grounded Synthesis',
                desc: 'Related ContentItems covering the same underlying AI development across multiple publishers (e.g. OpenAI release + arXiv paper + TechCrunch report + HN discussion) are clustered into cohesive Stories. An authoritative representative item is selected as canonical.'
            },
            '5': {
                title: 'Stage 5: Deterministic 6-Signal Ranking Engine',
                tech: 'Recency (25%) • Relevance (25%) • Authority (20%) • Coverage (15%) • Engagement (10%) • Diversity (5%)',
                desc: 'Evaluates each Story with zero black-box scoring. Employs exponential time-decay half-life math, domain authority matrices, multi-source corroboration counts, and cross-format diversity signals to produce normalized [0.0, 1.0] scores.'
            },
            '6': {
                title: 'Stage 6: Editorial Curation & Diversity Feed',
                tech: 'Topic Caps • Source Caps • Diversity Enforcement • REST API Engine',
                desc: 'Curates the top-tier stories for the executive news digest while enforcing topic and source diversity caps, preventing feed monopolization by a single vendor or topic. Serves real-time responses via high-throughput FastAPI endpoints.'
            }
        };

        const item = info[stepNum] || info['1'];
        inspector.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                <strong style="color:var(--as-color-accent);font-size:1rem;">${item.title}</strong>
                <span style="font-size:0.75rem;color:var(--as-color-text-secondary);">${item.tech}</span>
            </div>
            <p style="color:var(--as-color-text-primary);margin:0;font-size:0.875rem;">${item.desc}</p>
        `;
    }

    animateNumber(element, target) {
        let current = 0;
        const duration = 1000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current).toLocaleString();
        }, 16);
    }

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Auto-initialize when loaded on project page or embedded
document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.as-news-project-wrap');
    if (root) {
        const controller = new AiNewsProjectController();
        controller.init();
        window.__aiNewsController = controller;
    }
});
