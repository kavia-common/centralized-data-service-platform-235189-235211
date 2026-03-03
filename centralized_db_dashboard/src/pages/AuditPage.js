import React, { useEffect, useState } from 'react';
import { getAuditLog } from '../api/dataApi';
import { useAuth } from '../auth/useAuth';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { Panel } from '../components/Panel';

// PUBLIC_INTERFACE
export function AuditPage() {
  /** Audit trail view. */
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const data = await getAuditLog(token, { limit: 50, offset: 0 });
        const list = data?.items || data?.events || data || [];
        if (mounted) setItems(Array.isArray(list) ? list : []);
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load audit log.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <Panel title="Audit Trail">
      {isLoading ? <Loader label="Loading audit log…" /> : null}
      {error ? <Banner variant="error" title="Audit error">{error}</Banner> : null}

      {!isLoading && !error ? (
        items.length === 0 ? (
          <Banner variant="info" title="No data">
            Backend returned no audit entries.
          </Banner>
        ) : (
          <table className="Table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td className="mono">{row.timestamp || row.createdAt || row.created_at || '—'}</td>
                  <td className="mono">{row.actor || row.user || row.userEmail || '—'}</td>
                  <td className="mono">{row.action || row.event || '—'}</td>
                  <td className="mono">{row.target || row.resource || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : null}
    </Panel>
  );
}
