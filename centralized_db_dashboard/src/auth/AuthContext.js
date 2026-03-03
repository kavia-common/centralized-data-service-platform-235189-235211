import React, { createContext, useCallback, useMemo, useState } from 'react';
import { clearAuth, loadAuth, saveAuth } from './auth';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** React context provider for auth state. */
  const initial = loadAuth();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);

  const setSession = useCallback((next) => {
    const nextToken = next?.token || null;
    const nextUser = next?.user || null;
    setToken(nextToken);
    setUser(nextUser);
    saveAuth({ token: nextToken, user: nextUser });
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearAuth();
  }, []);

  const value = useMemo(() => ({ token, user, setSession, logout }), [token, user, setSession, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
