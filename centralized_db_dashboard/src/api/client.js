/**
 * Minimal API client for the dashboard.
 * Uses fetch + JSON; includes auth token if present.
 */

const DEFAULT_TIMEOUT_MS = 20000;

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

function normalizeError(err) {
  if (err?.name === 'AbortError') {
    return { message: 'Request timed out. Please try again.' };
  }
  if (typeof err?.message === 'string') return { message: err.message };
  return { message: 'Request failed. Please try again.' };
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the backend base URL (override with REACT_APP_API_BASE_URL). */
  return (process.env.REACT_APP_API_BASE_URL || '').trim() || 'http://localhost:3001';
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', token, body, query } = {}) {
  /** Performs a JSON API request and returns {data}. Throws {message, status, details}. */
  const baseUrl = getApiBaseUrl();
  const url = new URL(path, baseUrl);

  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const { signal, cancel } = timeoutSignal(DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

    if (!res.ok) {
      const message =
        (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
        (typeof payload === 'string' && payload) ||
        `Request failed with status ${res.status}`;

      const error = new Error(String(message));
      // Attach extra fields for callers that want structured details.
      error.status = res.status;
      error.details = payload;
      throw error;
    }

    return { data: payload };
  } catch (err) {
    if (err?.message && err?.status) throw err;
    throw normalizeError(err);
  } finally {
    cancel();
  }
}
