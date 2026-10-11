/**
 * Project Architecture & Evolution Controller
 * Manages on-page interactive pipelines, v1-v4 ablation milestone switcher,
 * layman vs deep architecture toggles, and click-to-inspect stage node inspectors.
 */

export const RAG_VERSIONS = {
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

export const OTHER_PROJECTS = {
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

export function selectRagVersion(versionNum) {
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

export function toggleProjectExplanation(projectKey) {
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

export function inspectProjectStage(projectKey, stageIndex) {
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

export function initProjectEvolution() {
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
