/**
 * Architecture Deep Dive Modal Controller
 * Renders technical architecture diagrams, math engines, and benchmark specifications
 * with interactive Layman / Business View vs Deep Architecture View and clickable stage inspectors.
 */

export const PROJECT_ARCH_DATA = {
    'nexus-rag': {
        title: 'NEXUS RAG: Enterprise All-Rounder Document Intelligence Platform',
        subtitle: 'Hybrid Dense + Sparse Retrieval Engine with Deterministic Math Guardrails & Table Reconstruction',
        tags: ['Python', 'FastAPI', 'Qdrant', 'BM25', 'Sentence-Transformers', 'Gemini'],
        metrics: [
            { label: 'Recall@10', value: '85.71% (Up from 0.0% in v1)' },
            { label: 'MRR@10', value: '0.7738 (Answers in top 1-2 chunks)' },
            { label: 'Arithmetic Accuracy', value: '100% Deterministic (Python AST)' },
            { label: 'Evaluation Dataset', value: 'SEC 10-K & Multi-Domain Benchmarks' }
        ],
        layman: `<strong>What It Does (In Simple Words):</strong> Think of NEXUS RAG as an AI-powered super-librarian equipped with an error-free financial calculator. When companies search through massive, messy libraries of files (like 100-page corporate financial reports, legal contracts, or technical manuals), standard search tools miss key context and AI models hallucinate fake numbers. NEXUS reads thousands of pages instantly, pinpoints the exact verified paragraph with page citations, and uses real Python code for mathematical calculations—guaranteeing 100% accurate mathematical answers.`,
        tech: `<strong>Production Architecture:</strong> Multi-stage enterprise RAG platform. Ingests heterogeneous corporate documents and extracts tables into structured Markdown/JSON without cutting rows. Executes concurrent dual-channel retrieval across Qdrant (768-dim dense vectors) and BM25 (sparse lexical index) merged via Reciprocal Rank Fusion (RRF k=60). Quantitative queries are routed to an AST-level Python math engine, eliminating LLM arithmetic hallucinations. Covered by strict Recall@10, MRR@10, and adversarial negative query rejection benchmarks.`,
        architecture: `[Complex Document / SEC 10-K] ──► [Layout-Aware Table Parser] ──► [Contextual Chunking]
                                                                      │
                                   ┌──────────────────────────────────┴──────────────────────────────────┐
                                   ▼                                                                     ▼
                      [Dense Stream: Sentence-Transformers]                                 [Sparse Stream: BM25 Okapi]
                                   │                                                                     │
                                   ▼                                                                     ▼
                        [Qdrant Vector DB (HNSW)]                                             [Inverted Keyword Index]
                                   │                                                                     │
                                   └──────────────────────────────────┬──────────────────────────────────┘
                                                                      ▼
                                                       [Reciprocal Rank Fusion (RRF k=60)]
                                                                      │
                                                                      ▼
                                                           [Query Intent Router]
                                                               ├── If Math: [Python AST Math Engine] ──► [100% Verified Answer]
                                                               └── If Text: [Google Gemini LLM]      ──► [Grounded Answer + Citations]`,
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
        ],
        highlights: [
            '<strong>Custom Deterministic Financial Math Module:</strong> Extracted balance sheet tables and numeric statements are routed to a verified Python interpreter before LLM synthesis, completely eliminating arithmetic hallucinations.',
            '<strong>Hybrid Retrieval Pipeline:</strong> Combines Qdrant vector similarity with BM25 lexical keyword matching via Reciprocal Rank Fusion, achieving 85.71% Recall@10 on SEC filing QA pairs.',
            '<strong>Empirical Ablation Progression:</strong> Tested systematically across 4 iterations (v1 Dense Baseline -> v2 BM25 Lexical -> v3 Hybrid RRF -> v4 Production Structure-Aware), proving measurable recall gains.'
        ],
        github: 'https://github.com/abdullahshaikh-0078'
    },
    'ai-news': {
        title: 'AI News Intelligence & Synthesis Platform',
        subtitle: 'Production Autonomous Ingestion, Native PostgreSQL 18 pgvector Deduplication & 6-Signal Ranking',
        tags: ['Python', 'FastAPI', 'PostgreSQL 18', 'pgvector 0.8.6', 'Gemini AI', 'Docker', 'SQLAlchemy'],
        metrics: [
            { label: 'Ingested Articles', value: '1,300+ items (ArXiv, HN, YouTube, RSS)' },
            { label: 'Vector Dimensions', value: '1536-dim (Google Gemini Embeddings)' },
            { label: 'Deduplication', value: 'Native pgvector Cosine Operator (<=>)' },
            { label: 'Automated Test Suite', value: '159/159 Passing Pytest Cases' }
        ],
        layman: `<strong>What It Does (In Simple Words):</strong> Instead of forcing an engineer to browse 100 tech blogs and social feeds every morning, this autonomous system reads over 1,300 AI articles, spots when multiple media outlets are reporting on the exact same research paper, merges duplicate stories, ranks the top 5 breakthroughs objectively, and emails a clean 2-minute executive digest directly to your inbox.`,
        tech: `<strong>Production Architecture:</strong> Multi-worker asynchronous data ingestion and synthesis pipeline. Sweeps 8+ continuous streams, normalizes metadata, and generates 1536-dim Gemini embeddings. Employs PostgreSQL 18 with native C-compiled pgvector 0.8.6 for zero-overhead in-database cosine distance (<=>) deduplication. Computes transparent 6-signal composite scores (Recency, Relevance, Authority, Coverage, Engagement, Diversity) and dispatches automated newsletters.`,
        architecture: `[8+ Ingestion Sources (ArXiv, RSS, YouTube, HN)]
       │
       ▼ (Async Crawler & Normalizer Pipeline)
[Content Normalizer & Deduplication Hasher]
       │
       ▼ (Google Gemini Embedding Service)
[1536-Dimensional Dense Semantic Embeddings]
       │
       ▼
[PostgreSQL 18 + Native pgvector 0.8.6] ──► [In-Database Cosine Distance (<=>) Deduplication]
       │
       ▼
[Story Clustering & Synthesis Engine] (Clusters multi-source coverage into unified master stories)
       │
       ▼
[Transparent 6-Signal Deterministic Ranking] (Recency, Relevance, Authority, Coverage, Engagement, Diversity)
       │
       ▼
[Editorial Diversity Filters] ──► [FastAPI REST Endpoints] & [Automated Daily Newsletter via Resend]`,
        stages: [
            { num: '01', name: 'Multi-Source Sweeper', sub: 'ArXiv, HN, RSS, YouTube', tech: 'Feedparser • YouTube API', desc: 'Continuously sweeps 8+ authoritative sources across official research repos, community discussions, and tech journalism.', input: 'Raw RSS feeds, JSON endpoints, video transcripts', output: 'Raw unparsed content payloads' },
            { num: '02', name: 'Content Normalization', sub: 'Canonical URLs & Hashes', tech: 'Pydantic v2 Models', desc: 'Extracts author metadata, publication dates, canonical URLs, and computes SHA-256 content hashes to reject duplicate URLs instantly.', input: 'Raw content payloads', output: 'Sanitized ContentItem records' },
            { num: '03', name: 'Semantic Embeddings', sub: '1536-dim Vector Space', tech: 'Google Gemini Embeddings', desc: 'Generates dense vector representations capturing fine-grained technical meaning, architecture names, and research concepts.', input: 'Normalized title & body text', output: '1536-dimensional floating point vectors' },
            { num: '04', name: 'pgvector Deduplication', sub: 'Cosine Distance (<=>)', tech: 'PostgreSQL 18 + pgvector 0.8.6', desc: 'Executes native C-extension vector similarity directly inside the database, detecting semantically duplicate reporting with zero network latency.', input: 'New vector embeddings', output: 'Cosine similarity matrix & duplicate cluster links' },
            { num: '05', name: 'Story Clustering Engine', sub: 'Multi-Source Synthesis', tech: 'Agglomerative Clusterer', desc: 'Aggregates individual articles, papers, and community posts covering the exact same development into a single authoritative master story.', input: 'Clustered content items', output: 'Unified Story records with source citations' },
            { num: '06', name: '6-Signal Ranking', sub: 'Transparent Scoring', tech: 'Deterministic Scorer', desc: 'Evaluates each story objectively: Recency (25%), Relevance (25%), Authority (20%), Coverage (15%), Engagement (10%), and Format Diversity (5%).', input: 'Story clusters + metadata signals', output: 'Deterministic ranking score (0-100)' },
            { num: '07', name: 'Editorial Diversity Filter', sub: 'Anti-Monopoly Caps', tech: 'Curation Guardrail', desc: 'Applies source and topic caps to ensure no single corporate entity or topic dominates the daily digest, ensuring balanced technical coverage.', input: 'Ranked story candidates', output: 'Balanced top-10 curated digest feed' },
            { num: '08', name: 'Automated Dispatch & API', sub: 'Resend API + FastAPI', tech: 'FastAPI • Jinja2 • Resend', desc: 'Renders responsive HTML newsletters sent to active subscribers on schedule, while serving high-speed JSON endpoints for live web display.', input: 'Curated stories + subscriber preferences', output: 'Delivered email briefings & REST JSON feeds' }
        ],
        highlights: [
            '<strong>Native Database Vector Deduplication:</strong> Uses pgvector 0.8.6 cosine similarity indexing within PostgreSQL 18 to automatically cluster duplicate reporting into unified story nodes.',
            '<strong>Transparent 6-Signal Ranking:</strong> Computes objective story scores combining velocity, source authority, technical depth, novelty, community engagement, and cross-source corroboration.',
            '<strong>Full Production Test Suite:</strong> Verified with 159 passing pytest test cases covering database schemas, API routes, and digest delivery.'
        ],
        github: 'https://github.com/abdullahshaikh-0078',
        demo: 'projects/ai-news.html'
    },
    'fastcloud': {
        title: 'FastCloud: AI-Powered Natural Language Cloud Automation Platform',
        subtitle: 'Autonomous Multi-Cloud Deployment & Orchestration Engine with DAG Dependency Resolution',
        tags: ['Node.js', 'Express', 'MongoDB', 'AWS SDK', 'Azure SDK', 'Gemini'],
        metrics: [
            { label: 'Supported Clouds', value: 'AWS & Microsoft Azure' },
            { label: 'Execution Model', value: 'Multi-Step Validated DAG' },
            { label: 'Safety Hooks', value: 'Pre-flight Validation & Rollback' },
            { label: 'Storage & Telemetry', value: 'MongoDB Audit Logs' }
        ],
        layman: `<strong>What It Does (In Simple Words):</strong> Setting up cloud servers on Amazon Web Services (AWS) or Microsoft Azure is notoriously complicated—it requires clicking through dozens of confusing configuration screens. FastCloud lets developers type what they need in plain English (e.g. "Deploy a secure web server with a PostgreSQL database in Mumbai"), and the AI automatically figures out the correct technical settings, connects directly to AWS or Azure, and provisions the infrastructure safely in seconds.`,
        tech: `<strong>Production Architecture:</strong> Conversational DevOps platform converting natural language requests into idempotent, multi-cloud deployment workflows. Google Gemini parses user intent into typed parameter specifications. A Directed Acyclic Graph (DAG) sequencing engine resolves technical resource dependencies before dispatching asynchronous provisioning calls via official AWS SDK v3 and Azure Resource Management SDKs, backed by automated rollback guards.`,
        architecture: `[Natural Language Deployment Prompt]
       │
       ▼
[Gemini Intent Parser & Parameter Extractor]
       │
       ▼
[Cloud Security & Policy Validator] (Verifies IAM permissions, CIDR blocks, and resource limits)
       │
       ▼
[Directed Acyclic Graph (DAG) Dependency Resolver] (Sequences VPC -> Subnets -> Security Groups -> VMs)
       │
       ├──► [AWS SDK v3 Orchestrator]   (EC2, S3, RDS, VPC)
       └──► [Azure SDK Orchestrator]     (VMs, Blob, AKS, Virtual Networks)
       │
       ▼
[Asynchronous Status Poller & Transactional Rollback Guard]
       │
       ▼
[MongoDB Deployment Telemetry & Audit Logs] ──► [Interactive AI Cloud Assistant]`,
        stages: [
            { num: '01', name: 'NL Prompt Ingestion', sub: 'Web Console & REST API', tech: 'Express.js Async Handler', desc: 'Accepts unstructured conversational deployment instructions from developers via web dashboard or API endpoints.', input: 'Natural language text prompt', output: 'Sanitized query payload' },
            { num: '02', name: 'Gemini Intent Parser', sub: 'Structured JSON Extraction', tech: 'Google Gemini API', desc: 'Extracts architectural intent, target cloud provider, regions, instance sizes, storage limits, and networking requirements.', input: 'Prompt text', output: 'Validated JSON deployment specification' },
            { num: '03', name: 'Policy & Quota Validator', sub: 'Pre-Flight Security Check', tech: 'Security Guardrail', desc: 'Validates user permissions, CIDR block allocations, and regional quota limits against AWS/Azure governance rules before execution.', input: 'JSON deployment specification', output: 'Approved execution plan or parameter error' },
            { num: '04', name: 'DAG Dependency Resolver', sub: 'Topological Sorter', tech: 'Directed Acyclic Graph', desc: 'Orders resource creation topologically (e.g. Virtual Private Cloud and Subnets must be provisioned before Virtual Machines).', input: 'Unordered resource list', output: 'Ordered multi-step execution graph' },
            { num: '05', name: 'Multi-Cloud SDK Engine', sub: 'AWS & Azure Dispatch', tech: 'AWS SDK v3 • Azure SDKs', desc: 'Dispatches authenticated, asynchronous infrastructure provisioning calls to target cloud providers with shared configuration contracts.', input: 'Ordered execution steps', output: 'Cloud provider task IDs & async promises' },
            { num: '06', name: 'Asynchronous Status Poller', sub: 'Lifecycle State Tracker', tech: 'Event-Driven Poller', desc: 'Polls cloud provider resource creation status in real-time, streaming status updates back to the client interface.', input: 'Provider task IDs', output: 'Real-time provisioning progress telemetry' },
            { num: '07', name: 'Transactional Rollback', sub: 'Fail-Safe De-provisioner', tech: 'Idempotency Engine', desc: 'If any downstream step fails during deployment, previously created resources are de-provisioned cleanly to avoid orphaned cloud expenses.', input: 'Error state trigger', output: 'Clean resource teardown & audit log' },
            { num: '08', name: 'AI Cloud Assistant', sub: 'Diagnostics & Telemetry', tech: 'Gemini Assistant • MongoDB', desc: 'Provides conversational architecture recommendations, cost optimization tips, and automated troubleshooting for failed deployments.', input: 'Deployment logs & user questions', output: 'Contextual diagnostics & optimization advice' }
        ],
        highlights: [
            '<strong>Natural Language to Cloud Workflows:</strong> Developers state their infrastructure intent in plain English and FastCloud generates validated deployment execution graphs.',
            '<strong>Dual-Cloud Abstraction:</strong> Seamlessly routes resource provisioning calls across AWS SDK and Azure SDK with shared configuration contracts.',
            '<strong>Fail-Safe Execution:</strong> Includes automated pre-flight policy checks and transactional rollback routines in the event of partial deployment failures.'
        ],
        github: 'https://github.com/abdullahshaikh-0078'
    },
    'nexus-agent': {
        title: 'Nexus AI Assistant: Custom Agent & MCP Platform',
        subtitle: 'Framework-Free Autonomous Agent Architecture with Model Context Protocol (FastMCP) & Repository Awareness',
        tags: ['Python', 'Google Gemini', 'FastMCP', 'Model Context Protocol', 'Voice I/O'],
        metrics: [
            { label: 'Framework Overhead', value: 'Zero (100% Custom Native Python)' },
            { label: 'Tool Protocol', value: 'Model Context Protocol (FastMCP)' },
            { label: 'Voice Interaction', value: 'Full-Duplex Speech & Neural TTS' },
            { label: 'Code Comprehension', value: 'AST-Level Semantic Symbol Graph' }
        ],
        layman: `<strong>What It Does (In Simple Words):</strong> Most AI chatbots can only chat, but they cannot do anything in the real world. Nexus is an autonomous digital worker: you can speak to it using your voice, and it can inspect code files on your computer, understand the codebase, select the right tools, and execute complex multi-step programming and computer tasks all on its own using the new industry-standard Model Context Protocol.`,
        tech: `<strong>Production Architecture:</strong> Lightweight, framework-free autonomous agent runtime constructed natively without bloated third-party agent frameworks. Operates an explicit Thought -> Plan -> Tool Selection -> Execution -> Observation -> Self-Correction loop. Integrates FastMCP (Model Context Protocol) for dynamic tool discovery, coupled to an AST code parser for repository context and real-time voice streaming.`,
        architecture: `[User Voice / Text Request]
       │
       ▼ (SpeechRecognition / Text Parser)
[Autonomous Task Planner] ◄──► [Episodic Memory & State Tree]
       │
       ▼ (FastMCP Client Interface)
[Model Context Protocol Hub]
       ├──► Tool 1: File & Code System Introspection (AST-aware)
       ├──► Tool 2: Shell & Runtime Execution Sandbox
       └──► Tool 3: Web & API Intelligence Retrieval
       │
       ▼
[Execution & Self-Correction Loop] (Reflects on tool output, diagnoses errors, and adapts)
       │
       ▼
[Execution Synthesizer] ──► [Structured Text Response / Neural Speech Output via pyttsx3]`,
        stages: [
            { num: '01', name: 'Multimodal Input Ingest', sub: 'Voice & Text Handlers', tech: 'SpeechRecognition • WebRTC', desc: 'Ingests user instructions via microphone or terminal. Handles ambient noise calibration and continuous speech-to-text transcription.', input: 'Microphone audio stream or text prompt', output: 'Transcribed user command' },
            { num: '02', name: 'Autonomous Task Planner', sub: 'Thought-Plan-Act Cycle', tech: 'Google Gemini Reasoning', desc: 'Decomposes complex ambiguous goals into a sequence of ordered, executable sub-tasks with explicit success criteria.', input: 'User command', output: 'Multi-step action plan' },
            { num: '03', name: 'FastMCP Tool Discovery', sub: 'Standardized Handshake', tech: 'FastMCP / Model Context Protocol', desc: 'Dynamically connects to local and remote MCP tool servers to discover available tools, argument schemas, and execution boundaries.', input: 'Connected MCP endpoints', output: 'Validated tool registry & function schemas' },
            { num: '04', name: 'AST Codebase Scanner', sub: 'Symbol Hierarchy Tree', tech: 'Python AST Module', desc: 'Traverses local project directories and builds an abstract syntax tree representation of functions, classes, and import relationships.', input: 'Local directory path', output: 'Structural symbol map & contextual slices' },
            { num: '05', name: 'Sandboxed Tool Execution', sub: 'Filesystem & Shell', tech: 'Deterministic Tool Runner', desc: 'Executes filesystem edits, shell commands, and API requests safely within a controlled permission boundary.', input: 'Tool name + validated arguments', output: 'Raw tool stdout, stderr, or JSON result' },
            { num: '06', name: 'Observation & Reflection', sub: 'Autonomous Self-Correction', tech: 'Agentic Feedback Loop', desc: 'Inspects execution results; if a tool call fails or tests fail, the agent diagnoses the error and refines its approach autonomously.', input: 'Tool execution output', output: 'Self-corrected plan or task completion signal' },
            { num: '07', name: 'Episodic Memory Store', sub: 'Context Retention', tech: 'In-Memory State Tree', desc: 'Maintains execution history, tool states, and observations across multi-turn sessions for persistent contextual continuity.', input: 'Session trace events', output: 'Context-enriched memory window' },
            { num: '08', name: 'Neural Speech Output', sub: 'Hands-Free Synthesis', tech: 'pyttsx3 Neural TTS', desc: 'Synthesizes conversational voice feedback locally with minimal latency for hands-free interactive developer workflows.', input: 'Final synthesized answer text', output: 'Low-latency spoken audio stream' }
        ],
        highlights: [
            '<strong>Framework-Free Design:</strong> Avoids fragile abstraction layers by implementing raw prompt chaining, explicit state trees, and dynamic reflection natively in Python.',
            '<strong>Model Context Protocol (MCP) Native:</strong> Connects to FastMCP tool servers, allowing hot-plugging of custom capabilities and developer tooling.',
            '<strong>Repository-Aware Code Understanding:</strong> Parses abstract syntax trees (AST) to build structural symbol graphs of codebases for targeted context injection.'
        ],
        github: 'https://github.com/abdullahshaikh-0078'
    }
};

export class ProjectModalController {
    constructor() {
        this.backdrop = document.getElementById('as-arch-modal-backdrop');
        this.closeBtn = document.getElementById('as-arch-modal-close');
        this.container = document.getElementById('as-arch-modal-content');
        this.currentProjectKey = null;
        this.isPlainEnglish = false;

        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('[data-arch-target], [data-project]');
            if (targetBtn) {
                e.preventDefault();
                e.stopPropagation();
                const key = targetBtn.getAttribute('data-arch-target') || targetBtn.getAttribute('data-project');
                this.openModal(key);
            }
        });

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        if (this.backdrop) {
            this.backdrop.addEventListener('click', (e) => {
                if (e.target === this.backdrop) this.closeModal();
            });
        }

        // Prevent scroll chaining/leak at modal boundaries
        const modalBox = this.backdrop ? this.backdrop.querySelector('.as-arch-modal-box') : null;
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

        if (this.backdrop && !this.backdrop.__wheelBound) {
            this.backdrop.__wheelBound = true;
            this.backdrop.addEventListener('wheel', (e) => {
                if (e.target === this.backdrop) {
                    e.preventDefault();
                }
            }, { passive: false });
        }

        window.__projectModalController = this;
    }

    toggleViewMode() {
        this.isPlainEnglish = !this.isPlainEnglish;
        this.renderModalBody();
    }

    inspectStage(index) {
        const data = PROJECT_ARCH_DATA[this.currentProjectKey];
        if (!data || !data.stages || !data.stages[index]) return;

        const stage = data.stages[index];
        const inspectorEl = document.getElementById('as-modal-inspector');
        if (!inspectorEl) return;

        document.querySelectorAll('.as-stage-node-btn').forEach((btn, idx) => {
            if (idx === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        inspectorEl.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;gap:0.4rem;">
                <div style="display:flex;align-items:center;gap:0.45rem;">
                    <span style="font-family:var(--font-mono);font-size:0.75rem;padding:0.15rem 0.4rem;border-radius:4px;background:rgba(56,189,248,0.15);color:var(--as-color-accent);font-weight:700;">STAGE ${stage.num}</span>
                    <strong style="color:var(--foreground);font-size:0.9rem;">${stage.name}</strong>
                </div>
                <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--muted-foreground);">${stage.tech}</span>
            </div>
            <p style="color:var(--muted-foreground);font-size:0.8125rem;margin:0 0 0.5rem 0;line-height:1.5;">${stage.desc}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.5rem;font-size:0.75rem;">
                <div style="background:var(--surface);padding:0.4rem 0.6rem;border-radius:6px;border:1px solid var(--border);">
                    <span style="color:var(--muted-foreground);font-weight:600;display:block;">Input:</span>
                    <span style="color:var(--foreground);">${stage.input}</span>
                </div>
                <div style="background:var(--surface);padding:0.4rem 0.6rem;border-radius:6px;border:1px solid var(--border);">
                    <span style="color:var(--muted-foreground);font-weight:600;display:block;">Output:</span>
                    <span style="color:var(--as-color-accent);">${stage.output}</span>
                </div>
            </div>
        `;
    }

    renderModalBody() {
        const data = PROJECT_ARCH_DATA[this.currentProjectKey];
        if (!data || !this.container) return;

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

        let stagesHTML = '';
        if (data.stages && data.stages.length > 0) {
            const stageBtns = data.stages.map((s, idx) => `
                <button type="button" class="as-stage-node-btn ${idx === 0 ? 'active' : ''}" onclick="window.__projectModalController.inspectStage(${idx})" style="text-align:left;padding:0.5rem 0.65rem;border-radius:8px;border:1px solid var(--border);background:var(--muted);cursor:pointer;transition:all var(--transition);display:flex;flex-direction:column;gap:0.2rem;">
                    <div style="display:flex;align-items:center;justify-content:space-between;">
                        <span style="font-family:var(--font-mono);font-size:0.6875rem;font-weight:700;color:var(--as-color-accent);">${s.num}</span>
                        <span style="font-size:0.65rem;color:var(--muted-foreground);">${s.tech.split('•')[0]}</span>
                    </div>
                    <div style="font-size:0.75rem;font-weight:700;color:var(--foreground);">${s.name}</div>
                    <div style="font-size:0.6875rem;color:var(--muted-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.sub}</div>
                </button>
            `).join('');

            stagesHTML = `
                <h4>⚡ Granular System Workflow (${data.stages.length} Subsystem Stages)</h4>
                <p style="font-size:0.75rem;color:var(--muted-foreground);margin:-0.25rem 0 0.5rem 0;">Click any stage below to inspect its data inputs, outputs, and operational logic &darr;</p>
                <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:0.4rem;margin-bottom:0.75rem;">
                    ${stageBtns}
                </div>
                <div id="as-modal-inspector" style="background:var(--muted);border:1px solid var(--border-strong);border-radius:8px;padding:0.75rem;margin-bottom:1rem;">
                    <!-- Injected by inspectStage(0) -->
                </div>
            `;
        }

        const explanationHTML = this.isPlainEnglish
            ? `<div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);border-radius:8px;padding:0.85rem;margin-bottom:1rem;color:var(--foreground);font-size:0.875rem;line-height:1.6;">${data.layman}</div>`
            : `<div style="background:var(--muted);border:1px solid var(--border);border-radius:8px;padding:0.85rem;margin-bottom:1rem;color:var(--foreground);font-size:0.875rem;line-height:1.6;">${data.tech}</div>`;

        this.container.innerHTML = `
            <div class="as-arch-modal-header" style="flex-wrap:wrap;">
                <div style="flex:1;min-width:260px;">
                    <h3 class="as-arch-modal-title">${data.title}</h3>
                    <p class="as-arch-modal-subtitle">${data.subtitle}</p>
                    <div style="margin-top: 0.6rem;">${tagsHTML}</div>
                </div>
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <button type="button" class="as-btn as-btn-secondary as-btn-sm" onclick="window.__projectModalController.toggleViewMode()" style="font-size:0.75rem;padding:0.35rem 0.75rem;">
                        ${this.isPlainEnglish ? '⚙️ Switch to Technical View' : '👔 Switch to Plain English'}
                    </button>
                </div>
            </div>

            <div class="as-arch-content">
                ${explanationHTML}

                ${stagesHTML}

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

        if (data.stages && data.stages.length > 0) {
            this.inspectStage(0);
        }
    }

    openModal(projectKey) {
        if (!this.backdrop) {
            this.backdrop = document.getElementById('as-arch-modal-backdrop');
            this.closeBtn = document.getElementById('as-arch-modal-close');
            this.container = document.getElementById('as-arch-modal-content');
        }
        if (!PROJECT_ARCH_DATA[projectKey]) return;

        this.currentProjectKey = projectKey;
        this.renderModalBody();

        this.backdrop.style.display = 'flex';
        this.backdrop.classList.add('open');
        this.backdrop.setAttribute('aria-hidden', 'false');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (!this.backdrop) return;
        this.backdrop.classList.remove('open');
        this.backdrop.setAttribute('aria-hidden', 'true');
        this.backdrop.style.display = 'none';
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
}

// Global helper access
window.ProjectModalController = ProjectModalController;
window.openArchModal = (key) => {
    if (!window.__projectModalController) {
        new ProjectModalController();
    }
    window.__projectModalController.openModal(key);
};

window.closeArchModal = () => {
    if (window.__projectModalController) {
        window.__projectModalController.closeModal();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ProjectModalController());
} else {
    new ProjectModalController();
}
