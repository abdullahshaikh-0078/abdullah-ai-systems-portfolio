/**
 * Minimalist White/Black Theme Controller
 * Supports one-click toggle with Sun/Moon SVGs, persistence in localStorage,
 * system preference detection, keyboard accessibility, and zero theme flash.
 */

export const SUN_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

export const MOON_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

export function applyTheme(isLight) {
    const root = document.documentElement;
    const body = document.body;
    const themeButtons = document.querySelectorAll("#as-theme-toggle, .as-theme-btn");

    if (isLight) {
        root.classList.add("as-light-theme");
        root.setAttribute("data-theme", "light");
        if (body) body.classList.add("as-light-theme");
        try { localStorage.setItem("as-theme", "light"); } catch (e) {}

        themeButtons.forEach(btn => {
            btn.innerHTML = MOON_ICON;
            btn.setAttribute("title", "Switch to Dark Mode");
            btn.setAttribute("aria-label", "Switch to Dark Mode");
        });
    } else {
        root.classList.remove("as-light-theme");
        root.setAttribute("data-theme", "dark");
        if (body) body.classList.remove("as-light-theme");
        try { localStorage.setItem("as-theme", "dark"); } catch (e) {}

        themeButtons.forEach(btn => {
            btn.innerHTML = SUN_ICON;
            btn.setAttribute("title", "Switch to Light Mode");
            btn.setAttribute("aria-label", "Switch to Light Mode");
        });
    }
}

export function toggleTheme() {
    const isCurrentlyLight = document.documentElement.classList.contains("as-light-theme") ||
        (document.body && document.body.classList.contains("as-light-theme")) ||
        document.documentElement.getAttribute("data-theme") === "light";
    applyTheme(!isCurrentlyLight);
}

// Attach globally for inline button handlers
if (typeof window !== "undefined") {
    window.toggleTheme = toggleTheme;
    window.applyTheme = applyTheme;
}

export function initTheme() {
    let isLight = false;
    try {
        const urlTheme = new URLSearchParams(window.location.search).get("theme");
        const savedTheme = urlTheme || localStorage.getItem("as-theme");
        const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        isLight = savedTheme === "light" || (!savedTheme && !systemPrefersDark && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches);
    } catch (e) {
        isLight = false;
    }

    applyTheme(isLight);

    // Bind all theme toggles
    const themeButtons = document.querySelectorAll("#as-theme-toggle, .as-theme-btn");
    themeButtons.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            toggleTheme();
        };
        btn.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleTheme();
            }
        };
    });
}

// Initialize on DOM load or immediately if already loaded
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTheme);
    } else {
        initTheme();
    }
}