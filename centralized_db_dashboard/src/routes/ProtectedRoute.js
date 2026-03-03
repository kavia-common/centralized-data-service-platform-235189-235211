import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { hasRole } from '../auth/auth';
import { Banner } from '../components/Banner';

// PUBLIC_INTERFACE
export function ProtectedRoute({ children, roles }) {
  /** Protects routes: redirects to /login if unauthenticated; blocks if role not allowed. */
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (Array.isArray(roles) && roles.length > 0 && !hasRole(user, roles.map((r) => String(r).toLowerCase()))) {
    return (
      <div style={{ padding: 18 }}>
        <Banner variant="error" title="Access denied">
          Your role does not have access to this page.
        </Banner>
      </div>
    );
  }

  return children;
}
