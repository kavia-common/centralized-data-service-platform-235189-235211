import React, { useEffect, useState } from 'react';
import { getMetrics } from '../api/dataApi';
import { useAuth } from '../auth/useAuth';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { Panel } from '../components/Panel';

// PUBLIC_INTERFACE
export function MetricsPage() {
  /** Service metrics view. */
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const data = await getMetrics(token);
        if (mounted) setMetrics(data);
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load metrics.');
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
    <Panel title="Metrics">
      {isLoading ? <Loader label="Loading metrics…" /> : null}
      {error ? <Banner variant="error" title="Metrics error">{error}</Banner> : null}

      {!isLoading && !error ? (
        metrics ? (
          <pre className="mono" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(metrics, null, 2)}
          </pre>
        ) : (
          <Banner variant="info" title="No data">
            Backend returned no metrics payload.
          </Banner>
        )
      ) : null}
    </Panel>
  );
}
