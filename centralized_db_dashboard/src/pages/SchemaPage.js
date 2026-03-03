import React, { useEffect, useMemo, useState } from 'react';
import { addColumn, createTable, getSchemaOverview } from '../api/dataApi';
import { useAuth } from '../auth/useAuth';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { Panel } from '../components/Panel';

// PUBLIC_INTERFACE
export function SchemaPage() {
  /** Schema explorer + basic management actions. */
  const { token } = useAuth();

  const [schema, setSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Create table
  const [tableName, setTableName] = useState('');
  const [columnsJson, setColumnsJson] = useState('[{"name":"id","type":"uuid","primaryKey":true}]');
  const [isCreating, setIsCreating] = useState(false);

  // Add column
  const [targetTable, setTargetTable] = useState('');
  const [columnJson, setColumnJson] = useState('{"name":"created_at","type":"timestamp"}');
  const [isAdding, setIsAdding] = useState(false);

  const tableOptions = useMemo(() => {
    const tables = schema?.tables || schema?.items || schema?.data || [];
    if (Array.isArray(tables)) return tables;
    return [];
  }, [schema]);

  async function reload() {
    setIsLoading(true);
    setError('');
    try {
      const data = await getSchemaOverview(token);
      setSchema(data);
    } catch (err) {
      setError(err?.message || 'Failed to load schema.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onCreateTable(e) {
    e.preventDefault();
    setActionMsg('');
    setError('');

    if (!tableName.trim()) {
      setError('Table name is required.');
      return;
    }

    let cols;
    try {
      cols = JSON.parse(columnsJson);
      if (!Array.isArray(cols)) throw new Error('Columns must be a JSON array.');
    } catch (err) {
      setError(err?.message || 'Invalid columns JSON.');
      return;
    }

    setIsCreating(true);
    try {
      await createTable(token, { tableName: tableName.trim(), columns: cols });
      setActionMsg('Table created.');
      setTableName('');
      await reload();
    } catch (err) {
      setError(err?.message || 'Failed to create table.');
    } finally {
      setIsCreating(false);
    }
  }

  async function onAddColumn(e) {
    e.preventDefault();
    setActionMsg('');
    setError('');

    if (!targetTable.trim()) {
      setError('Target table is required.');
      return;
    }

    let col;
    try {
      col = JSON.parse(columnJson);
      if (!col || typeof col !== 'object') throw new Error('Column must be a JSON object.');
    } catch (err) {
      setError(err?.message || 'Invalid column JSON.');
      return;
    }

    setIsAdding(true);
    try {
      await addColumn(token, { tableName: targetTable.trim(), column: col });
      setActionMsg('Column added.');
      await reload();
    } catch (err) {
      setError(err?.message || 'Failed to add column.');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="Grid2">
      <Panel title="Schema Overview" actions={<button className="Btn" onClick={reload} type="button">Refresh</button>}>
        {isLoading ? <Loader label="Loading schema…" /> : null}
        {error ? <Banner variant="error" title="Schema error">{error}</Banner> : null}
        {actionMsg ? <Banner variant="success" title="Action">{actionMsg}</Banner> : null}

        {!isLoading && !error ? (
          schema ? (
            <pre className="mono" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(schema, null, 2)}
            </pre>
          ) : (
            <Banner variant="info" title="No data">
              Backend returned no schema payload.
            </Banner>
          )
        ) : null}
      </Panel>

      <div style={{ display: 'grid', gap: 14 }}>
        <Panel title="Create Table">
          <form onSubmit={onCreateTable}>
            <div className="FieldRow">
              <label className="Label" htmlFor="tableName">
                Table name
              </label>
              <input
                id="tableName"
                className="Input mono"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="events"
              />
            </div>

            <div className="FieldRow">
              <label className="Label" htmlFor="columnsJson">
                Columns (JSON array)
              </label>
              <textarea
                id="columnsJson"
                className="Textarea mono"
                value={columnsJson}
                onChange={(e) => setColumnsJson(e.target.value)}
              />
            </div>

            <button className="Btn BtnPrimary" type="submit" disabled={isCreating}>
              {isCreating ? 'Creating…' : 'Create'}
            </button>
          </form>
        </Panel>

        <Panel title="Add Column">
          <form onSubmit={onAddColumn}>
            <div className="FieldRow">
              <label className="Label" htmlFor="targetTable">
                Target table
              </label>
              <select
                id="targetTable"
                className="Select mono"
                value={targetTable}
                onChange={(e) => setTargetTable(e.target.value)}
              >
                <option value="">Select…</option>
                {tableOptions.map((t, idx) => {
                  const name = t.name || t.table || t.tableName || String(t);
                  return (
                    <option key={t.id || name || idx} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="FieldRow">
              <label className="Label" htmlFor="columnJson">
                Column (JSON object)
              </label>
              <textarea
                id="columnJson"
                className="Textarea mono"
                value={columnJson}
                onChange={(e) => setColumnJson(e.target.value)}
              />
            </div>

            <button className="Btn BtnPrimary" type="submit" disabled={isAdding}>
              {isAdding ? 'Adding…' : 'Add Column'}
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}
