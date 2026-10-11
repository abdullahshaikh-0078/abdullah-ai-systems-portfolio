/**
 * AI News Platform - API Client
 * Production client connecting to live Render backend or local FastAPI development server.
 */

import {
  PROD_API_BASE_URL,
  LOCAL_API_BASE_URL,
  resolveApiBaseUrl,
  buildApiUrl
} from "./config.js";

export {
  PROD_API_BASE_URL,
  LOCAL_API_BASE_URL,
  resolveApiBaseUrl,
  buildApiUrl
};

export const API_BASE_URL = resolveApiBaseUrl();

export class ApiError extends Error {
  constructor(message, status = 0, code = "UNKNOWN_ERROR", details = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Execute HTTP JSON requests with robust error extraction and path normalization.
 * @param {string} endpoint
 * @param {RequestInit} [options={}]
 * @returns {Promise<any>}
 */
async function fetchJson(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
  } catch (netErr) {
    throw new ApiError(
      `Network connection failed: ${netErr.message || "Unable to reach server"}. Ensure backend is running at ${resolveApiBaseUrl()}`,
      0,
      "NETWORK_ERROR"
    );
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return { status: "success" };
  }

  // Handle HTTP error responses
  if (!res.ok) {
    let errorData = null;
    let rawText = "";

    try {
      rawText = await res.text();
      if (rawText) {
        errorData = JSON.parse(rawText);
      }
    } catch (_) {
      // Non-JSON response (e.g. HTML error page or plain text)
    }

    let message = "";
    let details = [];

    if (errorData) {
      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        // FastAPI validation errors
        details = errorData.detail;
        message = errorData.detail
          .map((d) => (d.msg ? (d.loc && d.loc.length > 1 ? `${d.loc.slice(1).join(".")}: ${d.msg}` : d.msg) : JSON.stringify(d)))
          .join("; ");
      } else if (errorData.error && typeof errorData.error.message === "string") {
        message = errorData.error.message;
        details = errorData.error.details || [];
      } else if (typeof errorData.message === "string") {
        message = errorData.message;
      }
    }

    if (!message) {
      if (rawText && rawText.length < 200 && !rawText.trim().startsWith("<")) {
        message = rawText.trim();
      } else {
        message = `HTTP ${res.status}: ${res.statusText || "Request failed"}`;
      }
    }

    const code =
      (errorData && (errorData.code || (errorData.error && errorData.error.code))) ||
      (res.status === 422 ? "VALIDATION_ERROR" : `HTTP_${res.status}`);

    throw new ApiError(message, res.status, code, details);
  }

  // Handle successful response body
  try {
    return await res.json();
  } catch (parseErr) {
    throw new ApiError(
      `Invalid response from server: expected JSON, but received non-JSON payload (${parseErr.message})`,
      res.status,
      "INVALID_RESPONSE"
    );
  }
}

export const aiNewsApi = {
  /**
   * Get real-time system metrics directly from backend
   */
  async getOverview() {
    return fetchJson("/overview");
  },

  /**
   * Get curated stories feed with optional topic and content_type filters
   */
  async getCuratedStories({ limit = 20, offset = 0, topic = null, contentType = null } = {}) {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (topic) params.append("topic", topic);
    if (contentType) params.append("content_type", contentType);
    return fetchJson("/curation/stories?" + params.toString());
  },

  /**
   * Get story details with member items
   */
  async getStoryDetails(storyId) {
    return fetchJson("/stories/" + encodeURIComponent(storyId));
  },

  /**
   * Get transparent 6-signal ranking explanation for a story
   */
  async getStoryRanking(storyId) {
    return fetchJson("/stories/" + encodeURIComponent(storyId) + "/ranking");
  },

  /**
   * Get paginated content items directly from backend
   */
  async getContentItems({ page = 1, pageSize = 20, contentType = null } = {}) {
    const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    if (contentType) params.append("content_type", contentType);
    return fetchJson("/content?" + params.toString());
  },

  /**
   * Subscribe to AI News Daily Digest
   */
  async subscribeToAINews(data) {
    return fetchJson("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  /**
   * Update subscriber preferences
   */
  async updateAINewsPreferences(data) {
    return fetchJson("/newsletter/preferences", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  /**
   * Unsubscribe from AI News
   */
  async unsubscribeFromAINews(data) {
    return fetchJson("/newsletter/unsubscribe", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  /**
   * Get latest digest issue
   */
  async getLatestDigest() {
    return fetchJson("/digests/latest");
  }
};

if (typeof window !== "undefined") {
  window.aiNewsApi = aiNewsApi;
}
