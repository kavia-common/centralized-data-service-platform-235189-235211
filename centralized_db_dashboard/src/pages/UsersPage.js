import React, { useEffect, useState } from 'react';
import { listUsers, updateUserRole } from '../api/dataApi';
import { useAuth } from '../auth/useAuth';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { Panel } from '../components/Panel';

const ROLE_OPTIONS = ['admin', 'developer', 'viewer'];

// PUBLIC_INTERFACE
export function UsersPage() {
  /** Admin: manage users and roles. */
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function reload() {
    setIsLoading(true);
    setError('');
    try {
      const data = await listUsers(token);
      const list = data?.items || data?.users || data || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onRoleChange(userId, role) {
    setError('');
    setInfo('');
    setIsSaving(true);
    try {
      await updateUserRole(token, { userId, role });
      setInfo('Role updated.');
      await reload();
    } catch (err) {
      setError(err?.message || 'Failed to update role.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Panel
      title="Users & Roles"
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="Btn" onClick={reload} disabled={isLoading || isSaving}>
            Refresh
          </button>
        </div>
      }
    >
      {isLoading ? <Loader label="Loading users…" /> : null}
      {error ? <Banner variant="error" title="Admin error">{error}</Banner> : null}
      {info ? <Banner variant="success" title="OK">{info}</Banner> : null}

      {!isLoading && !error ? (
        users.length === 0 ? (
          <Banner variant="info" title="No users">
            Backend returned no user list.
          </Banner>
        ) : (
          <table className="Table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const id = u.id || u.userId || idx;
                const email = u.email || u.username || '—';
                const role = String(u.role || 'viewer').toLowerCase();
                return (
                  <tr key={id}>
                    <td className="mono">{String(id)}</td>
                    <td className="mono">{email}</td>
                    <td>
                      <select
                        className="Select mono"
                        value={role}
                        onChange={(e) => onRoleChange(id, e.target.value)}
                        disabled={isSaving}
                        aria-label={`Role for ${email}`}
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="mono">{u.updatedAt || u.updated_at || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      ) : null}
    </Panel>
  );
}
