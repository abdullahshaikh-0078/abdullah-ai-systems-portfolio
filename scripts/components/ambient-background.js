/**
 * Ambient AI Live Background Component (Frontend-Only)
 * Renders faint technical computational nodes and dynamic connections
 * with zero external dependencies, low CPU overhead, and theme awareness.
 */

export class AmbientAIBackground {
    constructor() {
        this.canvas = document.getElementById('as-ambient-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        // Check reduced motion preference
        this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.reducedMotion) return;

        this.nodes = [];
        this.nodeCount = window.innerWidth < 768 ? 22 : 42;
        this.connectionDistance = 120;
        this.animationFrameId = null;
        this.isRunning = false;

        this.init();
    }

    init() {
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
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                radius: Math.random() * 1.5 + 1,
                alpha: Math.random() * 0.25 + 0.15
            });
        }
    }

    bindEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createNodes();
            }, 200);
        }, { passive: true });

        // Pause animation when tab is not active to conserve system resources
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
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
                        (document.body && document.body.classList.contains('as-light-theme')) ||
                        document.documentElement.getAttribute('data-theme') === 'light';

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Subtle colors based on theme
        const nodeColor = isLight ? 'rgba(24, 24, 27, ' : 'rgba(244, 244, 245, ';
        const lineColor = isLight ? 'rgba(39, 39, 42, ' : 'rgba(212, 212, 216, ';

        // Update and draw nodes
        const len = this.nodes.length;
        for (let i = 0; i < len; i++) {
            const node = this.nodes[i];

            node.x += node.vx;
            node.y += node.vy;

            // Wrap around edges smoothly
            if (node.x < 0) node.x = this.width;
            else if (node.x > this.width) node.x = 0;
            if (node.y < 0) node.y = this.height;
            else if (node.y > this.height) node.y = 0;

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = nodeColor + (node.alpha * (isLight ? 0.6 : 0.8)) + ')';
            this.ctx.fill();

            // Connect nearby nodes
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

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AmbientAIBackground());
} else {
    new AmbientAIBackground();
}
