/**
 * AI News Platform - API Client
 * Production client connecting to FastAPI backend at http://127.0.0.1:8000/api/v1
 */

export const API_BASE_URL = window.__AI_NEWS_API_URL__ || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://127.0.0.1:8000/api/v1" : "/api/v1");

export class ApiError extends Error {
  constructor(message, status, code, details = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function fetchJson(endpoint, options = {}) {
  const url = API_BASE_URL + endpoint;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      let errorData = {};
      try {
        errorData = await res.json();
      } catch (e) {
        // non-JSON response
      }
      const err = errorData.error || {};
      throw new ApiError(
        err.message || ("HTTP " + res.status + ": " + res.statusText),
        res.status,
        err.code || "REQUEST_FAILED",
        err.details || []
      );
    }

    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Network connection failed: " + err.message + ". Ensure backend is running at " + API_BASE_URL,
      0,
      "NETWORK_ERROR"
    );
  }
}

export const aiNewsApi = {
  /**
   * Get real-time system metrics directly from PostgreSQL
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
    return fetchJson("/stories/" + storyId);
  },

  /**
   * Get transparent 6-signal ranking explanation for a story
   */
  async getStoryRanking(storyId) {
    return fetchJson("/stories/" + storyId + "/ranking");
  },

  /**
   * Get paginated content items directly from PostgreSQL
   */
  async getContentItems({ page = 1, pageSize = 20, contentType = null } = {}) {
    const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    if (contentType) params.append("content_type", contentType);
    return fetchJson("/content?" + params.toString());
  },
/**
   * Phase 17: Subscribe to AI News Daily Digest
   */
  async subscribeToAINews(data) {
    return fetchJson('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Phase 17: Update subscriber preferences
   */
  async updateAINewsPreferences(data) {
    return fetchJson('/newsletter/preferences', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Phase 17: Unsubscribe from AI News
   */
  async unsubscribeFromAINews(data) {
    return fetchJson('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Phase 17: Get latest digest issue
   */
  async getLatestDigest() {
    return fetchJson('/digests/latest');
  }
};
