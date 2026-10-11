document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("as-systems-grid");

    if (!grid) {
        return;
    }

    const systems = [
        {
            icon: "🌐",
            title: "AI News Intelligence & Synthesis Platform",
            description: "Production autonomous intelligence engine with Google Gemini embeddings, native PostgreSQL 18 pgvector cosine deduplication, multi-source clustering, and 6-signal deterministic ranking.",
            tags: ["FastAPI", "PostgreSQL 18", "pgvector 0.8.6", "Gemini AI", "Cosine Dedup", "Deterministic Ranking"],
            featured: true,
            liveBadge: "LIVE SYSTEM",
            link: "projects/ai-news.html"
        },
        {
            icon: "🎯",
            title: "Recommendation System",
            description: "Two-stage retrieval and ranking architecture with ANN search and offline/online evaluation metrics.",
            tags: ["FAISS", "Embeddings", "Ranking"]
        },
        {
            icon: "⚡",
            title: "Real-Time ML Pipeline",
            description: "Streaming ML architecture for event ingestion, feature generation, and real-time inference.",
            tags: ["Streaming", "Kafka", "FastAPI"]
        },
        {
            icon: "🔮",
            title: "Generative AI RAG",
            description: "Retrieval augmented generation system using embeddings and vector search pipelines.",
            tags: ["LLM", "Vector DB", "RAG"]
        },
        {
            icon: "📊",
            title: "Decision Intelligence",
            description: "Causal inference and experimentation framework for business decision modeling.",
            tags: ["A/B Testing", "Causal ML", "Analytics"]
        },
        {
            icon: "🏗️",
            title: "Distributed Backend",
            description: "Scalable backend architecture with caching, load balancing, and concurrency control.",
            tags: ["Distributed", "Caching", "Scaling"]
        }
    ];

    grid.innerHTML = "";

    systems.forEach(system => {
        const card = document.createElement("div");
        card.className = "as-system-card" + (system.featured ? " as-system-featured" : "");

        const tagsHTML = system.tags
            .map(tag => `<span class="as-system-tag">${tag}</span>`)
            .join("");

        const liveBadgeHTML = system.liveBadge ? `
            <div style="position: absolute; top: 1rem; right: 1rem; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.6rem; border-radius: 9999px; background: rgba(76,201,240,0.12); border: 1px solid rgba(76,201,240,0.3); font-size: 0.7rem; font-weight: 700; color: var(--as-color-accent); letter-spacing: 0.05em;">
                <span style="width:6px;height:6px;border-radius:50%;background:#10b981;"></span>
                ${system.liveBadge}
            </div>
        ` : '';

        const actionHTML = system.link ? `
            <div style="margin-top: 1.25rem;">
                <a href="${system.link}" class="as-btn-source" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.95rem;font-size:0.825rem;border-radius:6px;text-decoration:none;">
                    Launch Live Demo & Deep Dive &rarr;
                </a>
            </div>
        ` : '';

        card.innerHTML = `
            ${liveBadgeHTML}
            <div class="as-system-icon" style="font-size: 2rem; margin-bottom: 0.75rem;">${system.icon}</div>
            <h3 class="as-system-title" style="margin-bottom: 0.5rem;">${system.title}</h3>
            <p class="as-system-description">${system.description}</p>
            <div class="as-system-tags">
                ${tagsHTML}
            </div>
            ${actionHTML}
        `;

        if (system.link) {
            card.style.cursor = "pointer";
            card.addEventListener("click", (e) => {
                // If user didn't click directly on the link, navigate anyway
                if (!e.target.closest("a")) {
                    window.location.href = system.link;
                }
            });
        } else {
            card.addEventListener("click", () => {
                showSystemDetail(system);
            });
        }

        grid.appendChild(card);
    });

    function showSystemDetail(system) {
        const container = document.getElementById("as-system-content");
        if (!container) return;

        container.innerHTML = `
            <div class="as-system-detail-card">
                <h3>${system.icon} ${system.title}</h3>
                <p>${system.description}</p>
                <h4>Key Technologies</h4>
                <ul>
                    ${system.tags.map(tag => `<li>${tag}</li>`).join("")}
                </ul>
                ${system.link ? `<p><a href="${system.link}">Open System Page &rarr;</a></p>` : ''}
            </div>
        `;

        const detailSection = document.getElementById("as-system-detail");
        if (detailSection) {
            detailSection.scrollIntoView({ behavior: "smooth" });
        }
    }
});
