import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppShell } from './components/AppShell';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { QueryPage } from './pages/QueryPage';
import { HistoryPage } from './pages/HistoryPage';
import { SchemaPage } from './pages/SchemaPage';
import { UsersPage } from './pages/UsersPage';
import { MetricsPage } from './pages/MetricsPage';
import { AuditPage } from './pages/AuditPage';

// PUBLIC_INTERFACE
function App() {
  /** App entry: router + auth provider + protected layout. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/query" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated app */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/query" element={<QueryPage />} />
            <Route path="/history" element={<HistoryPage />} />

            {/* Schema management: Admin/Developer */}
            <Route
              path="/schema"
              element={
                <ProtectedRoute roles={['admin', 'developer']}>
                  <SchemaPage />
                </ProtectedRoute>
              }
            />

            {/* Admin only */}
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/audit" element={<AuditPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/query" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
