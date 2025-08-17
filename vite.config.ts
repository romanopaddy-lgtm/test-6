// ...existing code...
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  // carichiamo i plugin con import() per evitare problemi ESM vs require
  const [{ default: react }, { default: tsconfigPaths }] = await Promise.all([
    import('@vitejs/plugin-react'),
    import('vite-tsconfig-paths'),
  ]);

  return {
    plugins: [
      react(),
      tsconfigPaths(),
    ],
  };
});