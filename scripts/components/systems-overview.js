document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("as-systems-grid");

    const systems = [
        {
            title: "Large-Scale Recommendation System",
            description: "Two-stage retrieval and ranking architecture with FAISS ANN search and evaluation metrics."
        },
        {
            title: "Real-Time ML Pipeline",
            description: "Streaming inference pipeline with event ingestion and real-time model serving."
        },
        {
            title: "Generative AI RAG System",
            description: "Retrieval augmented generation with embedding pipelines and vector search."
        },
        {
            title: "Decision Intelligence Platform",
            description: "Causal inference and experimentation framework for business decisions."
        },
        {
            title: "Distributed Backend System",
            description: "Scalable backend architecture with caching and concurrency handling."
        }
    ];

    systems.forEach(system => {

        const card = document.createElement("div");
        card.className = "as-system-card";

        card.innerHTML = `
            <h3 class="as-system-title">${system.title}</h3>
            <p class="as-system-description">${system.description}</p>
        `;

        grid.appendChild(card);

    });

});