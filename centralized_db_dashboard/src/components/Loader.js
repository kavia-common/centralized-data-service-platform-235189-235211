import React from 'react';

// PUBLIC_INTERFACE
export function Loader({ label = 'Loading…' }) {
  /** Minimal loader text (CSS-only app; no extra dependencies). */
  return (
    <div className="Banner BannerInfo" role="status" aria-live="polite">
      <span className="mono">{label}</span>
    </div>
  );
}
