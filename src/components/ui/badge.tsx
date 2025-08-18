import React from 'react';


export const Badge: React.FC<{ variant?: string } & React.HTMLAttributes<HTMLSpanElement>> = ({ children, style, ...rest }) => (
  <span {...rest} style={{ display: 'inline-block', padding: '2px 6px', borderRadius: 9999, background: '#eef2ff', fontSize: 12, ...style }}>
    {children}
  </span>
);

export default Badge;