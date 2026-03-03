import React from 'react';

// PUBLIC_INTERFACE
export function Banner({ variant = 'info', title, children }) {
  /** Shows an info/success/error banner. */
  const cls =
    variant === 'error'
      ? 'Banner BannerError'
      : variant === 'success'
        ? 'Banner BannerSuccess'
        : 'Banner BannerInfo';

  return (
    <div className={cls} role={variant === 'error' ? 'alert' : 'status'} aria-live="polite">
      {title ? (
        <div style={{ marginBottom: children ? 6 : 0, fontWeight: 700, letterSpacing: 0.3 }}>{title}</div>
      ) : null}
      {children}
    </div>
  );
}
