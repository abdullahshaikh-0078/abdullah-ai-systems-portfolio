/**
 * AI News Platform - Centralized API Configuration
 * 
 * Provides runtime URL resolution, path normalization, and environment detection.
 * Avoids hardcoding or duplicating backend URLs across portfolio components.
 */

export const PROD_API_BASE_URL = "https://ai-news-intelligence-vvh5.onrender.com/api/v1";
export const LOCAL_API_BASE_URL = "http://127.0.0.1:8000/api/v1";

/**
 * Check if the provided hostname is a local development environment.
 * @param {string} [hostname]
 * @returns {boolean}
 */
export function isLocalHostname(hostname) {
  if (!hostname || typeof hostname !== "string") return false;
  const h = hostname.toLowerCase().trim();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "::1" ||
    h.endsWith(".local")
  );
}

/**
 * Resolves the active API base URL.
 * Order of precedence:
 * 1. window.__AI_NEWS_API_URL__ (runtime override, e.g. test injection or public runtime config)
 * 2. Local development URL if running on localhost / 127.0.0.1
 * 3. Production Render backend URL
 * 
 * @returns {string}
 */
export function resolveApiBaseUrl() {
  if (typeof window !== "undefined" && window.__AI_NEWS_API_URL__) {
    return window.__AI_NEWS_API_URL__;
  }
  if (typeof window !== "undefined" && window.location && isLocalHostname(window.location.hostname)) {
    return LOCAL_API_BASE_URL;
  }
  return PROD_API_BASE_URL;
}

/**
 * Normalizes and safely joins an endpoint path with the base API URL.
 * Guarantees:
 * - Trailing slashes on base URL are stripped
 * - Leading slash on endpoint is guaranteed
 * - Duplicate /api/v1 prefixes in endpoint are stripped
 * - Multi-slash paths are collapsed without affecting query parameters
 * 
 * @param {string} [endpoint=''] - Target endpoint (e.g. '/overview', 'overview', '/api/v1/overview')
 * @param {string} [baseUrl=null] - Optional base URL override
 * @returns {string} Fully qualified URL
 */
export function buildApiUrl(endpoint = "", baseUrl = null) {
  const base = (baseUrl || resolveApiBaseUrl()).replace(/\/+$/, "");
  let cleanEndpoint = (endpoint || "").trim();

  if (!cleanEndpoint) {
    return base;
  }

  // Ensure leading slash
  if (!cleanEndpoint.startsWith("/")) {
    cleanEndpoint = "/" + cleanEndpoint;
  }

  // Prevent duplicate /api/v1 prefix
  if (cleanEndpoint === "/api/v1") {
    cleanEndpoint = "";
  } else if (cleanEndpoint.startsWith("/api/v1/")) {
    cleanEndpoint = cleanEndpoint.substring("/api/v1".length);
  }

  // Handle double slashes in path while preserving query string
  const [pathPart, ...queryParts] = cleanEndpoint.split("?");
  const normalizedPath = pathPart.replace(/\/+/g, "/");
  const queryPart = queryParts.join("?");
  cleanEndpoint = queryPart ? `${normalizedPath}?${queryPart}` : normalizedPath;

  return base + cleanEndpoint;
}

// Expose on window for runtime introspection and non-module scripts
if (typeof window !== "undefined") {
  window.__AI_NEWS_API_URL__ = window.__AI_NEWS_API_URL__ || resolveApiBaseUrl();
  window.resolveApiBaseUrl = resolveApiBaseUrl;
  window.buildApiUrl = buildApiUrl;
}
