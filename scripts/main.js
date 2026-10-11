/**
 * Portfolio Main Entry Point
 * Bundles theme, navigation, telemetry, modal controllers, and newsletter components
 */

import "./core/theme.js";
import "./components/navbar.js";
import "./components/ambient-background.js";
import "./components/project-modal.js";
import "./components/project-evolution.js";
import "./components/copy-email.js";
import "./components/newsletter-signup.js";
import "./components/fastcloud-slideshow.js";
import "./core/scroll-reveal.js";

console.log("[Portfolio] Abdullah Mukhtar Shaikh - AI Systems Portfolio initialized.");

// Direct section navigation support for testing & deep linking
const urlParams = new URLSearchParams(window.location.search);
const sectionParam = urlParams.get("section") || window.location.hash.replace("#", "");
if (sectionParam) {
    const el = document.getElementById(sectionParam);
    if (el) {
        setTimeout(() => el.scrollIntoView(), 50);
    }
}

