/* ============================================================
   OpenCore — API Base Layer
   All Salesforce REST/OAuth communication goes through here.
   The UI never calls fetch() directly — always use this module.
   ============================================================ */

'use strict';

/* ── Configuration ─────────────────────────────────────────
   In production these values come from environment config
   or a Salesforce Connected App OAuth flow.
   ─────────────────────────────────────────────────────────── */
const ApiConfig = {
  /** Salesforce org base URL — set at deploy time */
  sfBaseUrl: window.OPENCORE_SF_URL || '',

  /** Salesforce API version */
  sfApiVersion: 'v59.0',

  /** Mock mode: when true, all calls resolve against MockData instead of hitting Salesforce.
   *  Flip to false once the Connected App OAuth flow is wired up. */
  mockMode: true,

  /** Simulated network latency (ms) in mock mode — realistic UX testing */
  mockDelay: 600,

  /** Auth token storage key */
  tokenKey: 'oc_sf_access_token',
};

/* ── Auth helpers ───────────────────────────────────────── */
const Auth = {
  getToken() {
    return sessionStorage.getItem(ApiConfig.tokenKey) || '';
  },
  setToken(token) {
    sessionStorage.setItem(ApiConfig.tokenKey, token);
  },
  clearToken() {
    sessionStorage.removeItem(ApiConfig.tokenKey);
  },
  isConnected() {
    return Boolean(this.getToken()) || ApiConfig.mockMode;
  },
};

/* ── Custom Error ────────────────────────────────────────── */
class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {string} errorCode   Salesforce error code, e.g. FIELD_CUSTOM_VALIDATION_EXCEPTION
   */
  constructor(message, statusCode = 0, errorCode = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

/* ── Core request function ──────────────────────────────── */
/**
 * Make an authenticated request to the Salesforce REST API.
 * @param {string} path      Path relative to /services/apexrest/ or /services/data/
 * @param {object} options   fetch-compatible options (method, body, headers, …)
 * @returns {Promise<any>}   Parsed JSON response
 */
async function sfRequest(path, options = {}) {
  const url = `${ApiConfig.sfBaseUrl}/services/apexrest${path}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${Auth.getToken()}`,
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    throw new ApiError(
      `Network error — could not reach Salesforce. ${networkErr.message}`,
      0,
      'NETWORK_ERROR'
    );
  }

  /* Salesforce returns 200 for most success and 204 for deletes */
  if (response.status === 204) return null;

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Unexpected response format from Salesforce.', response.status, 'PARSE_ERROR');
  }

  if (!response.ok) {
    /* Salesforce error shape: [{ message, errorCode }] or { message, errorCode } */
    const err = Array.isArray(data) ? data[0] : data;
    throw new ApiError(
      err.message || 'An unexpected Salesforce error occurred.',
      response.status,
      err.errorCode || 'SF_ERROR'
    );
  }

  return data;
}

/* ── Mock delay utility ─────────────────────────────────── */
function mockDelay(ms = ApiConfig.mockDelay) {
  return new Promise((res) => setTimeout(res, ms));
}

/* ── Mock failure simulation (for dev testing) ─────────── */
/** Set to true temporarily to test error states in the UI */
window.__OC_MOCK_FAIL__ = false;

async function mockResolve(data) {
  await mockDelay();
  if (window.__OC_MOCK_FAIL__) {
    throw new ApiError(
      'Simulated backend error — toggle window.__OC_MOCK_FAIL__ = false to stop.',
      500,
      'MOCK_FAILURE'
    );
  }
  return JSON.parse(JSON.stringify(data)); // deep clone so callers can't mutate the store
}

/* ── Connection status ──────────────────────────────────── */
async function testSalesforceConnection() {
  if (ApiConfig.mockMode) {
    await mockDelay(400);
    return { connected: true, orgName: 'OpenCore Dev Org', apiVersion: ApiConfig.sfApiVersion, mockMode: true };
  }
  try {
    const data = await sfRequest('/opencore/ping');
    return { connected: true, ...data, mockMode: false };
  } catch (err) {
    return { connected: false, error: err.message, mockMode: false };
  }
}

/* ── Exports (module-style, globally accessible) ────────── */
window.OcApi = {
  ApiConfig,
  Auth,
  ApiError,
  sfRequest,
  mockDelay,
  mockResolve,
  testSalesforceConnection,
};
