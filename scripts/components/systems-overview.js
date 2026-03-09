document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("as-systems-grid");

    if (!grid) {
        console.error("Systems grid container not found.");
        return;
    }

    const systems = [
        {
            icon: "🤖",
            title: "Recommendation System",
            description: "Two-stage retrieval and ranking architecture with ANN search and evaluation metrics.",
            tags: ["FAISS", "Embeddings", "Ranking"]
        },

        {
            icon: "⚡",
            title: "Real-Time ML Pipeline",
            description: "Streaming ML architecture for event ingestion, feature generation, and real-time inference.",
            tags: ["Streaming", "Kafka", "FastAPI"]
        },

        {
            icon: "🧠",
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
            icon: "💻",
            title: "Distributed Backend",
            description: "Scalable backend architecture with caching, load balancing, and concurrency control.",
            tags: ["Distributed", "Caching", "Scaling"]
        }
    ];

    systems.forEach(system => {

        const card = document.createElement("div");
        card.className = "as-system-card";

        const tagsHTML = system.tags
            .map(tag => `<span class="as-system-tag">${tag}</span>`)
            .join("");

        card.innerHTML = `
            <div class="as-system-icon">${system.icon}</div>
            <h3 class="as-system-title">${system.title}</h3>
            <p class="as-system-description">${system.description}</p>
            <div class="as-system-tags">
                ${tagsHTML}
            </div>
        `;

        card.addEventListener("click", () => {
            showSystemDetail(system);
        });

        grid.appendChild(card);
    });


    function showSystemDetail(system) {

        const container = document.getElementById("as-system-content");

        container.innerHTML = `
            <div class="as-system-detail-card">

                <h3>${system.icon} ${system.title}</h3>

                <p>${system.description}</p>

                <h4>Key Technologies</h4>

                <ul>
                    ${system.tags.map(tag => `<li>${tag}</li>`).join("")}
                </ul>

            </div>
        `;

        document
            .getElementById("as-system-detail")
            .scrollIntoView({ behavior: "smooth" });
    }

});