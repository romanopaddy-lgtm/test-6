// Module shims for aliased UI components and vite plugin used in the workspace.
// Minimal declarations to satisfy the TypeScript server.

declare module '@/components/ui/card' {
  import * as React from 'react';
  export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
}

declare module '@/components/ui/button' {
  import * as React from 'react';
  export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }>;
  export default Button;
}

declare module '@/components/ui/badge' {
  import * as React from 'react';
  export const Badge: React.FC<{ variant?: string } & React.HTMLAttributes<HTMLSpanElement>>;
  export default Badge;
}

declare module '@/components/ui/checkbox' {
  import * as React from 'react';
  export const Checkbox: React.FC<{
    checked?: boolean;
    onCheckedChange?: (v: boolean) => void;
  }>;
  export default Checkbox;
}

/* shim for vite react plugin (editor types) */
declare module '@vitejs/plugin-react' {
  const plugin: (...args: any[]) => any;
  export default plugin;
}