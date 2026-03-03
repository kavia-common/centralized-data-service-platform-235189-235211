import { apiRequest } from './client';

/**
 * NOTE:
 * The backend OpenAPI spec endpoint returned 404 in this environment.
 * These endpoints follow common conventions for JWT auth in Express apps.
 * If backend routes differ, adjust paths here (single place).
 */

const AUTH_BASE = '/auth';

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /** Logs in user and returns {token, user}. */
  const { data } = await apiRequest(`${AUTH_BASE}/login`, { method: 'POST', body: { email, password } });
  return data;
}

// PUBLIC_INTERFACE
export async function register({ email, password }) {
  /** Registers user and returns {token, user} or {user}. */
  const { data } = await apiRequest(`${AUTH_BASE}/register`, { method: 'POST', body: { email, password } });
  return data;
}

// PUBLIC_INTERFACE
export async function me(token) {
  /** Fetch current user profile. */
  const { data } = await apiRequest(`${AUTH_BASE}/me`, { method: 'GET', token });
  return data;
}
