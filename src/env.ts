export const env = {
  backend: import.meta.env.VITE_BACKEND ?? 'mock',
  useMock: (import.meta as any).env?.VITE_USE_MOCK === 'true' || (import.meta.env.VITE_BACKEND ?? 'mock') === 'mock',
  voiceAccent: import.meta.env.VITE_VOICE_ACCENT ?? 'uk',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};
