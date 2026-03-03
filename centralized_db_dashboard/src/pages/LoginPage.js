import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, me } from '../api/authApi';
import { Banner } from '../components/Banner';
import { useAuth } from '../auth/useAuth';

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Login screen. */
  const navigate = useNavigate();
  const { token, setSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, go to default page
  useEffect(() => {
    if (token) navigate('/query', { replace: true });
  }, [token, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await login({ email: email.trim(), password });

      const nextToken = resp?.token || resp?.accessToken || null;
      const maybeUser = resp?.user || null;

      if (!nextToken) {
        throw new Error('Login succeeded but no token was returned by the server.');
      }

      // If backend doesn't return user, attempt /auth/me
      let user = maybeUser;
      if (!user) {
        const profile = await me(nextToken);
        user = profile?.user || profile || null;
      }

      setSession({ token: nextToken, user });
      navigate('/query', { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="AuthShell">
      <div className="AuthCard">
        <div className="AuthCardHeader">
          <h1>Operator Login</h1>
          <span className="Pill mono">v01.00</span>
        </div>

        <div className="AuthCardBody">
          {error ? <Banner variant="error" title="Authentication error">{error}</Banner> : null}
          <form onSubmit={onSubmit}>
            <div className="FieldRow">
              <label className="Label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="Input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="name@company.com"
              />
            </div>

            <div className="FieldRow">
              <label className="Label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="Input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <button className="Btn BtnPrimary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Login'}
            </button>

            <div className="HelperLinks">
              <span className="mono">Backend: {process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}</span>
              <Link to="/register">Need access?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
