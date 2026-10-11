/**
 * FastCloud Interactive Product Slideshow Component
 * Displays 5 production screenshots showcasing FastCloud's end-to-end multi-cloud workflow.
 * Manages tabs, keyboard navigation, previous/next controls, and recruiter explanations.
 */

const FASTCLOUD_SLIDES = [
    {
        index: 0,
        tab: '01 • Prompt Bar',
        stage: 'STAGE 01: NATURAL LANGUAGE INGESTION',
        title: 'Infrastructure as Prompt: Conversational Cloud Entry',
        src: 'assets/images/fastcloud/slide-1-hero.png',
        alt: 'FastCloud Hero and Prompt Bar',
        explanation: 'Enables developers to describe complex multi-tier cloud environments in plain English instead of writing hundreds of lines of Terraform or navigating dozens of AWS/Azure console screens.'
    },
    {
        index: 1,
        tab: '02 • Architecture Studio',
        stage: 'STAGE 02: VISUAL BLACKBOARD & TOPOLOGY',
        title: 'Architecture Studio: Visual Multi-Cloud Blackboard',
        src: 'assets/images/fastcloud/slide-2-architecture-studio.png',
        alt: 'FastCloud Architecture Studio Visual Canvas',
        explanation: 'Interactive design canvas with an official cloud component palette (VMs, VNets, Subnets, NSGs, Gateways). Allows developers to visually connect and model multi-cloud topologies before provisioning.'
    },
    {
        index: 2,
        tab: '03 • Deploy CLI',
        stage: 'STAGE 03: CLOUD SHELL & DUAL DISPATCH',
        title: 'Multi-Cloud Workspace & Cloud Shell Deployment CLI',
        src: 'assets/images/fastcloud/slide-3-deploy-cli.png',
        alt: 'FastCloud Deploy CLI and Provider Workspace',
        explanation: 'Multi-cloud execution runtime supporting active Azure ARM and AWS credentials, paired with an integrated interactive Cloud Shell for direct CLI command execution and deployment management.'
    },
    {
        index: 3,
        tab: '04 • Dashboard',
        stage: 'STAGE 04: OPERATIONAL VISIBILITY & TELEMETRY',
        title: 'Operational Workspace Dashboard & Multi-Cloud Health',
        src: 'assets/images/fastcloud/slide-4-dashboard.png',
        alt: 'FastCloud Workspace Telemetry Dashboard',
        explanation: 'Real-time observability hub tracking Azure, AWS, and GCP workspace status, active deployment counts, assistant readiness states, and audit trails under a unified user account.'
    },
    {
        index: 4,
        tab: '05 • AI Engineer',
        stage: 'STAGE 05: EMBEDDED AI COPILOT',
        title: 'AI Cloud Engineer: Domain-Specific Cloud Assistant',
        src: 'assets/images/fastcloud/slide-5-ai-engineer.png',
        alt: 'FastCloud AI Cloud Engineer Console',
        explanation: 'Dedicated cloud copilot engineered exclusively for cloud architecture questions: recommends low-cost VM options, optimizes subnet routing, and provides live troubleshooting diagnostics.'
    }
];

export function initFastCloudSlideshow() {
    const container = document.getElementById('fastcloud-gallery');
    if (!container) return;

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

        // Update slides visibility
        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                slide.classList.add('is-active');
            } else {
                slide.classList.remove('is-active');
            }
        });

        // Update tabs
        tabs.forEach((tab, i) => {
            if (i === currentIndex) {
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('is-active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('is-active');
            } else {
                dot.classList.remove('is-active');
            }
        });

        // Update counter & caption
        if (counter) counter.textContent = `Slide ${currentIndex + 1} / ${totalSlides}`;
        if (stageBadge) stageBadge.textContent = data.stage;
        if (captionTitle) captionTitle.textContent = data.title;
        if (captionBody) captionBody.textContent = data.explanation;
    }

    // Tab clicks
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const idx = parseInt(tab.dataset.slideIndex, 10);
            if (!isNaN(idx)) showSlide(idx);
        });
    });

    // Dot clicks
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.index, 10);
            if (!isNaN(idx)) showSlide(idx);
        });
    });

    // Arrow buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
    }

    // Keyboard support when container has focus or mouse is over it
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            showSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            showSlide(currentIndex + 1);
        }
    });

    // Make container focusable for keyboard navigation
    if (!container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '0');
    }

    // Initialize first slide
    showSlide(0);

    // Scroll param support
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('scroll') === 'fastcloud-gallery') {
            container.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    } catch (err) {
        // ignore
    }
}

// Auto-run on DOMContentLoaded or immediate execution if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFastCloudSlideshow);
} else {
    initFastCloudSlideshow();
}
