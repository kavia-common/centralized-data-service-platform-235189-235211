import React, { useState } from 'react';
import { executeQuery } from '../api/dataApi';
import { useAuth } from '../auth/useAuth';
import { Banner } from '../components/Banner';
import { Panel } from '../components/Panel';

// PUBLIC_INTERFACE
export function QueryPage() {
  /** SQL execution console (validated by backend). */
  const { token, user } = useAuth();

  const [sql, setSql] = useState('SELECT NOW() as server_time;');
  const [params, setParams] = useState('[]');

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function onRun(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    let parsedParams = [];
    if (params.trim()) {
      try {
        parsedParams = JSON.parse(params);
        if (!Array.isArray(parsedParams)) {
          throw new Error('Params must be a JSON array.');
        }
      } catch (err) {
        setError(err?.message || 'Invalid params JSON.');
        return;
      }
    }

    if (!sql.trim()) {
      setError('SQL is required.');
      return;
    }

    setIsRunning(true);
    try {
      const data = await executeQuery(token, { sql, params: parsedParams });
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Query failed.');
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="Grid2">
      <Panel
        title="Execute SQL"
        actions={
          <span className="mono" style={{ color: 'rgba(255,255,255,0.65)' }}>
            user: {user?.email || 'unknown'}
          </span>
        }
      >
        {error ? <Banner variant="error" title="Execution error">{error}</Banner> : null}
        <form onSubmit={onRun}>
          <div className="FieldRow">
            <label className="Label" htmlFor="sql">
              SQL
            </label>
            <textarea
              id="sql"
              className="Textarea mono"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="SELECT * FROM table LIMIT 10;"
            />
          </div>

          <div className="FieldRow">
            <label className="Label" htmlFor="params">
              Params (JSON array)
            </label>
            <input
              id="params"
              className="Input mono"
              value={params}
              onChange={(e) => setParams(e.target.value)}
              placeholder='["param1", 2]'
            />
          </div>

          <button className="Btn BtnPrimary" type="submit" disabled={isRunning}>
            {isRunning ? 'Running…' : 'Run Query'}
          </button>
        </form>
      </Panel>

      <Panel title="Result (JSON)">
        {!result && !error ? (
          <Banner variant="info" title="Ready">
            Run a query to see results here.
          </Banner>
        ) : null}

        {result ? (
          <pre className="mono" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : null}
      </Panel>
    </div>
  );
}
