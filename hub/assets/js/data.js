/* ============================================================
   ELYSIUM TBILISI — Marketing Intelligence Hub
   data.js — Data loading utilities

   Loads from window.__ELYSIUM_DATA__ (injected by data-bundle.js)
   which enables file:// usage. Falls back to fetch() when served
   over HTTP and the bundle is unavailable.
   ============================================================ */

const BASE = './data';
const _cache = {};

function fromBundle(key) {
  if (typeof window !== 'undefined' && window.__ELYSIUM_DATA__ && window.__ELYSIUM_DATA__[key]) {
    return window.__ELYSIUM_DATA__[key];
  }
  return null;
}

async function fetchJSON(path, bundleKey) {
  // 1. Try inline bundle (works on file://)
  const inlineData = bundleKey ? fromBundle(bundleKey) : null;
  if (inlineData) return inlineData;

  // 2. Try cache
  if (_cache[path]) return _cache[path];

  // 3. Fetch over HTTP
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
    const data = await res.json();
    _cache[path] = data;
    return data;
  } catch (err) {
    console.error('[data.js] Failed to load:', path, err);
    return null;
  }
}

export async function loadGoogleKeywords() {
  return fetchJSON(`${BASE}/google/keywords.json`, 'keywords');
}

export async function loadGoogleCampaigns() {
  return fetchJSON(`${BASE}/google/campaigns.json`, 'campaigns');
}

export async function loadGoogleCompetitors() {
  return fetchJSON(`${BASE}/google/competitors.json`, 'competitors');
}

export async function loadGoogleNegatives() {
  return fetchJSON(`${BASE}/google/negatives.json`, 'negatives');
}

export async function loadResearchSummary() {
  return fetchJSON(`${BASE}/google/research_summary.json`, 'research');
}

export async function loadAnalytics() {
  return fetchJSON(`${BASE}/analytics/index.json`, null);
}

export async function loadMetaData() {
  return fetchJSON(`${BASE}/meta/index.json`, null);
}

export async function loadYandexData() {
  return fetchJSON(`${BASE}/yandex/index.json`, null);
}

/** Load all Google data in parallel */
export async function loadAllGoogleData() {
  const [keywords, campaigns, competitors, negatives, research] = await Promise.all([
    loadGoogleKeywords(),
    loadGoogleCampaigns(),
    loadGoogleCompetitors(),
    loadGoogleNegatives(),
    loadResearchSummary(),
  ]);
  return { keywords, campaigns, competitors, negatives, research };
}
