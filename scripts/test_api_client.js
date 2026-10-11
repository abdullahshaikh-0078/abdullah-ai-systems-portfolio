/**
 * Test Suite for AI News API Configuration and Client
 * Tests URL resolution, endpoint joining, duplicate prevention, and contract adherence.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  PROD_API_BASE_URL,
  LOCAL_API_BASE_URL,
  isLocalHostname,
  resolveApiBaseUrl,
  buildApiUrl
} from "./core/config.js";

import {
  API_BASE_URL,
  ApiError,
  aiNewsApi
} from "./core/api-client.js";

test("PROD_API_BASE_URL is configured to the Render backend with /api/v1 prefix", () => {
  assert.equal(PROD_API_BASE_URL, "https://ai-news-intelligence-vvh5.onrender.com/api/v1");
});

test("LOCAL_API_BASE_URL is configured to local FastAPI port 8000 with /api/v1 prefix", () => {
  assert.equal(LOCAL_API_BASE_URL, "http://127.0.0.1:8000/api/v1");
});

test("isLocalHostname correctly identifies local vs remote hosts", () => {
  // Local hostnames
  assert.equal(isLocalHostname("localhost"), true);
  assert.equal(isLocalHostname("127.0.0.1"), true);
  assert.equal(isLocalHostname("0.0.0.0"), true);
  assert.equal(isLocalHostname("::1"), true);
  assert.equal(isLocalHostname("dev-machine.local"), true);
  assert.equal(isLocalHostname("LOCALHOST"), true);

  // Production / remote hostnames
  assert.equal(isLocalHostname("abdullah-portfolio.vercel.app"), false);
  assert.equal(isLocalHostname("ai-news-intelligence-vvh5.onrender.com"), false);
  assert.equal(isLocalHostname("myportfolio.com"), false);
  assert.equal(isLocalHostname(""), false);
  assert.equal(isLocalHostname(null), false);
  assert.equal(isLocalHostname(undefined), false);
});

test("resolveApiBaseUrl honors window.__AI_NEWS_API_URL__ override", () => {
  const originalWindow = globalThis.window;
  try {
    globalThis.window = {
      __AI_NEWS_API_URL__: "https://staging-api.example.com/api/v1",
      location: { hostname: "localhost" }
    };
    assert.equal(resolveApiBaseUrl(), "https://staging-api.example.com/api/v1");
  } finally {
    globalThis.window = originalWindow;
  }
});

test("resolveApiBaseUrl selects LOCAL_API_BASE_URL on localhost", () => {
  const originalWindow = globalThis.window;
  try {
    globalThis.window = {
      location: { hostname: "localhost" }
    };
    assert.equal(resolveApiBaseUrl(), LOCAL_API_BASE_URL);

    globalThis.window.location.hostname = "127.0.0.1";
    assert.equal(resolveApiBaseUrl(), LOCAL_API_BASE_URL);
  } finally {
    globalThis.window = originalWindow;
  }
});

test("resolveApiBaseUrl selects PROD_API_BASE_URL in production", () => {
  const originalWindow = globalThis.window;
  try {
    globalThis.window = {
      location: { hostname: "abdullah-portfolio.vercel.app" }
    };
    assert.equal(resolveApiBaseUrl(), PROD_API_BASE_URL);
  } finally {
    globalThis.window = originalWindow;
  }
});

test("buildApiUrl handles various endpoint path formats correctly", () => {
  const prodBase = "https://ai-news-intelligence-vvh5.onrender.com/api/v1";

  // Standard endpoint with leading slash
  assert.equal(
    buildApiUrl("/overview", prodBase),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1/overview"
  );

  // Missing leading slash
  assert.equal(
    buildApiUrl("overview", prodBase),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1/overview"
  );

  // Trailing slash on base URL + leading slash on endpoint
  assert.equal(
    buildApiUrl("/overview", prodBase + "/"),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1/overview"
  );

  // Trailing slash on base URL + no leading slash on endpoint
  assert.equal(
    buildApiUrl("overview", prodBase + "/"),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1/overview"
  );

  // Endpoint mistakenly begins with duplicate /api/v1
  assert.equal(
    buildApiUrl("/api/v1/overview", prodBase),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1/overview"
  );

  // Endpoint mistakenly begins with duplicate /api/v1/newsletter/subscribe
  assert.equal(
    buildApiUrl("/api/v1/newsletter/subscribe", prodBase),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1/newsletter/subscribe"
  );

  // Endpoint with query parameters and duplicate /api/v1 prefix
  assert.equal(
    buildApiUrl("/api/v1/curation/stories?limit=20&topic=LLM", prodBase),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1/curation/stories?limit=20&topic=LLM"
  );

  // Endpoint with double slashes
  assert.equal(
    buildApiUrl("//newsletter//subscribe", prodBase),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1/newsletter/subscribe"
  );

  // Empty endpoint returns clean base without trailing slash
  assert.equal(
    buildApiUrl("", prodBase + "/"),
    "https://ai-news-intelligence-vvh5.onrender.com/api/v1"
  );
});

test("aiNewsApi exposes all required contracts and methods", () => {
  const requiredMethods = [
    "getOverview",
    "getCuratedStories",
    "getStoryDetails",
    "getStoryRanking",
    "getContentItems",
    "subscribeToAINews",
    "updateAINewsPreferences",
    "unsubscribeFromAINews",
    "getLatestDigest"
  ];

  for (const method of requiredMethods) {
    assert.equal(
      typeof aiNewsApi[method],
      "function",
      `Expected aiNewsApi.${method} to be a function`
    );
  }
});

test("ApiError instantiates with correct properties and error code", () => {
  const err = new ApiError("Validation failed", 422, "VALIDATION_ERROR", [{ loc: ["body", "email"], msg: "Invalid email" }]);
  assert.equal(err.name, "ApiError");
  assert.equal(err.message, "Validation failed");
  assert.equal(err.status, 422);
  assert.equal(err.code, "VALIDATION_ERROR");
  assert.equal(err.details.length, 1);
});
