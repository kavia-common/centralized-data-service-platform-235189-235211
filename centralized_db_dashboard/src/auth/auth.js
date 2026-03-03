/**
 * Local auth utilities (token + minimal user payload).
 * This is intentionally simple; backend should remain the source of truth.
 */

const STORAGE_KEY = 'cdbd_auth_v1';

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function loadAuth() {
  /** Loads auth {token, user} from localStorage. */
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { token: null, user: null };
  const parsed = safeJsonParse(raw);
  if (!parsed || typeof parsed !== 'object') return { token: null, user: null };
  return {
    token: typeof parsed.token === 'string' ? parsed.token : null,
    user: parsed.user && typeof parsed.user === 'object' ? parsed.user : null
  };
}

// PUBLIC_INTERFACE
export function saveAuth({ token, user }) {
  /** Persists auth {token, user} to localStorage. */
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: token || null, user: user || null }));
}

// PUBLIC_INTERFACE
export function clearAuth() {
  /** Clears auth from localStorage. */
  localStorage.removeItem(STORAGE_KEY);
}

// PUBLIC_INTERFACE
export function hasRole(user, roles = []) {
  /** Returns true if user.role is included in roles. */
  if (!user || !user.role) return false;
  return roles.includes(String(user.role).toLowerCase());
}

// PUBLIC_INTERFACE
export function roleLabel(user) {
  /** Converts a user role to a UI label. */
  const role = String(user?.role || '').toLowerCase();
  if (!role) return 'unknown';
  return role;
}
