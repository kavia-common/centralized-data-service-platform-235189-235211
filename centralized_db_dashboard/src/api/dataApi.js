import { apiRequest } from './client';

/**
 * Best-effort endpoints until backend OpenAPI spec is available.
 * Adjust these paths to match backend container routes.
 */

// PUBLIC_INTERFACE
export async function executeQuery(token, { sql, params }) {
  /** Executes a validated SQL query. */
  const { data } = await apiRequest('/query/execute', { method: 'POST', token, body: { sql, params } });
  return data;
}

// PUBLIC_INTERFACE
export async function listQueryHistory(token, { limit = 20, offset = 0 } = {}) {
  /** Retrieves query execution history. */
  const { data } = await apiRequest('/query/history', { method: 'GET', token, query: { limit, offset } });
  return data;
}

// PUBLIC_INTERFACE
export async function getSchemaOverview(token) {
  /** Returns schemas/tables overview. */
  const { data } = await apiRequest('/schema', { method: 'GET', token });
  return data;
}

// PUBLIC_INTERFACE
export async function createTable(token, { tableName, columns }) {
  /** Creates a table with columns. */
  const { data } = await apiRequest('/schema/tables', { method: 'POST', token, body: { tableName, columns } });
  return data;
}

// PUBLIC_INTERFACE
export async function addColumn(token, { tableName, column }) {
  /** Adds a column to an existing table. */
  const { data } = await apiRequest(`/schema/tables/${encodeURIComponent(tableName)}/columns`, {
    method: 'POST',
    token,
    body: { column }
  });
  return data;
}

// PUBLIC_INTERFACE
export async function listUsers(token) {
  /** Admin: list users. */
  const { data } = await apiRequest('/admin/users', { method: 'GET', token });
  return data;
}

// PUBLIC_INTERFACE
export async function updateUserRole(token, { userId, role }) {
  /** Admin: update a user's role. */
  const { data } = await apiRequest(`/admin/users/${encodeURIComponent(userId)}/role`, {
    method: 'PATCH',
    token,
    body: { role }
  });
  return data;
}

// PUBLIC_INTERFACE
export async function getMetrics(token) {
  /** Returns service metrics. */
  const { data } = await apiRequest('/metrics', { method: 'GET', token });
  return data;
}

// PUBLIC_INTERFACE
export async function getAuditLog(token, { limit = 50, offset = 0 } = {}) {
  /** Returns audit trail entries. */
  const { data } = await apiRequest('/audit', { method: 'GET', token, query: { limit, offset } });
  return data;
}
