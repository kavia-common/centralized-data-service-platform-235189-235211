import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, me } from '../api/authApi';
import { Banner } from '../components/Banner';
import { useAuth } from '../auth/useAuth';

// PUBLIC_INTERFACE
export function RegisterPage() {
  /** Registration screen. */
  const navigate = useNavigate();
  const { token, setSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (token) navigate('/query', { replace: true });
  }, [token, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await register({ email: email.trim(), password });

      const nextToken = resp?.token || resp?.accessToken || null;
      const maybeUser = resp?.user || null;

      if (nextToken) {
        let user = maybeUser;
        if (!user) {
          const profile = await me(nextToken);
          user = profile?.user || profile || null;
        }
        setSession({ token: nextToken, user });
        navigate('/query', { replace: true });
      } else {
        // Some backends may register without auto-login
        setInfo('Account created. Please login.');
      }
    } catch (err) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="AuthShell">
      <div className="AuthCard">
        <div className="AuthCardHeader">
          <h1>Create Access</h1>
          <span className="Pill mono">RBAC</span>
        </div>

        <div className="AuthCardBody">
          {error ? <Banner variant="error" title="Registration error">{error}</Banner> : null}
          {info ? <Banner variant="success" title="Success">{info}</Banner> : null}

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
                autoComplete="new-password"
                placeholder="min 8 characters"
              />
            </div>

            <button className="Btn BtnPrimary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Register'}
            </button>

            <div className="HelperLinks">
              <Link to="/login">Back to login</Link>
              <span className="mono">Neon-safe</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
