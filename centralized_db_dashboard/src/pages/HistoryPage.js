import React, { useEffect, useState } from 'react';
import { listQueryHistory } from '../api/dataApi';
import { useAuth } from '../auth/useAuth';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { Panel } from '../components/Panel';

// PUBLIC_INTERFACE
export function HistoryPage() {
  /** Displays query execution history. */
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
        const data = await listQueryHistory(token, { limit: 25, offset: 0 });
        const list = data?.items || data?.history || data || [];
        if (mounted) setItems(Array.isArray(list) ? list : []);
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load history.');
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
    <Panel title="Recent Queries">
      {isLoading ? <Loader label="Loading query history…" /> : null}
      {error ? <Banner variant="error" title="Load error">{error}</Banner> : null}

      {!isLoading && !error ? (
        items.length === 0 ? (
          <Banner variant="info" title="No data">
            No history entries returned by the backend.
          </Banner>
        ) : (
          <table className="Table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Statement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td className="mono">{row.timestamp || row.createdAt || row.created_at || '—'}</td>
                  <td className="mono">{row.user || row.actor || row.userEmail || '—'}</td>
                  <td className="mono" style={{ maxWidth: 520, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.sql || row.statement || row.query || '—'}
                  </td>
                  <td>
                    <span className="Pill">{String(row.status || row.result || 'unknown')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : null}
    </Panel>
  );
}
