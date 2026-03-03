import React from 'react';

// PUBLIC_INTERFACE
export function Panel({ title, actions, children }) {
  /** Standard panel container. */
  return (
    <section className="Panel">
      <div className="PanelHeader">
        <h2>{title}</h2>
        <div>{actions}</div>
      </div>
      <div className="PanelBody">{children}</div>
    </section>
  );
}
