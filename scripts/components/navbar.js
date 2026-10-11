/**
 * Navigation Bar Controller
 * Handles scroll effects, mobile hamburger menu, and active link state
 */

export function initNavbar() {
    const navbar = document.querySelector('.as-navbar');
    const mobileToggle = document.getElementById('as-mobile-toggle');
    const navLinks = document.querySelector('.as-nav-links');
    const navItems = document.querySelectorAll('.as-nav-links a[href^="#"]');

    if (!navbar) return;

    // Shrink navbar on scroll
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('as-scrolled');
        } else {
            navbar.classList.remove('as-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile Hamburger Toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('as-open');
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('as-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Active Section Tracking on Scroll
    const sections = Array.from(navItems)
        .map(link => {
            const id = link.getAttribute('href');
            return id && id.length > 1 ? document.querySelector(id) : null;
        })
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(s => observer.observe(s));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}
