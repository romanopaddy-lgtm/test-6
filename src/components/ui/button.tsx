import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }> = ({ children, style, ...rest }) => (
  <button {...rest} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#f3f4f6', cursor: 'pointer', ...style }}>
    {children}
  </button>
);

export default Button;