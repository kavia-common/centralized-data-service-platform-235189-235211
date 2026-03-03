import { useContext } from 'react';
import AuthContext from './AuthContext';

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns {token, user, setSession, logout}. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
