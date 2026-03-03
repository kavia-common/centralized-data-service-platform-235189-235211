import React, { useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { roleLabel } from '../auth/auth';

function navClass({ isActive }) {
  return isActive ? 'NavItem NavItemActive' : 'NavItem';
}

function pageMeta(pathname) {
  if (pathname.startsWith('/query')) return { title: 'Query Console', subtitle: 'Run validated SQL and review results' };
  if (pathname.startsWith('/history')) return { title: 'Query History', subtitle: 'Latest executed queries' };
  if (pathname.startsWith('/schema')) return { title: 'Schema Explorer', subtitle: 'Tables, columns, and structure' };
  if (pathname.startsWith('/users')) return { title: 'Users & Roles', subtitle: 'Administer access control' };
  if (pathname.startsWith('/metrics')) return { title: 'Metrics', subtitle: 'Performance & service telemetry' };
  if (pathname.startsWith('/audit')) return { title: 'Audit', subtitle: 'Security and activity log' };
  return { title: 'Dashboard', subtitle: 'Centralized Data Service' };
}

// PUBLIC_INTERFACE
export function AppShell() {
  /** Main authenticated layout with sidebar and header. */
  const { user, logout } = useAuth();
  const location = useLocation();

  const meta = useMemo(() => pageMeta(location.pathname), [location.pathname]);
  const role = roleLabel(user);

  return (
    <div className="AppShell">
      <aside className="Sidebar" aria-label="Sidebar navigation">
        <div className="Brand">
          <div className="BrandMark" aria-hidden="true" />
          <div className="BrandTitle">
            <strong>Central DB</strong>
            <span className="mono">{user?.email || user?.username || 'signed-in'}</span>
          </div>
        </div>

        <nav className="Nav">
          <div className="NavSectionLabel">Operations</div>

          <NavLink to="/query" className={navClass}>
            <span className="NavIcon" aria-hidden="true">
              ⌘
            </span>
            Query
          </NavLink>

          <NavLink to="/history" className={navClass}>
            <span className="NavIcon" aria-hidden="true">
              ↺
            </span>
            History
          </NavLink>

          <div className="NavSectionLabel">Manage</div>

          <NavLink to="/schema" className={navClass}>
            <span className="NavIcon" aria-hidden="true">
              ▦
            </span>
            Schema
          </NavLink>

          <NavLink to="/users" className={navClass}>
            <span className="NavIcon" aria-hidden="true">
              ⚑
            </span>
            Users/Roles
          </NavLink>

          <div className="NavSectionLabel">Observe</div>

          <NavLink to="/metrics" className={navClass}>
            <span className="NavIcon" aria-hidden="true">
              ∿
            </span>
            Metrics
          </NavLink>

          <NavLink to="/audit" className={navClass}>
            <span className="NavIcon" aria-hidden="true">
              ◴
            </span>
            Audit
          </NavLink>
        </nav>
      </aside>

      <header className="Header" aria-label="Top header">
        <div className="HeaderLeft">
          <div className="HeaderTitle">
            <strong>{meta.title}</strong>
            <span>{meta.subtitle}</span>
          </div>
        </div>

        <div className="HeaderRight">
          <span className={`Pill ${role === 'admin' ? 'PillAdmin' : role === 'developer' ? 'PillDev' : 'PillViewer'}`}>
            {role}
          </span>
          <button type="button" className="Btn BtnDanger" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="Main">
        <Outlet />
      </main>
    </div>
  );
}
