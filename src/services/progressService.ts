import { getSupabaseClient } from './supabaseClient';

export type Progress = { userId?: string; xp: number; streak: number; achievements: string[]; level: string; updatedAt?: string };

const KEY = 'panda.progress.v1';
const EMA_KEY = 'panda.ema.v1';

function loadLocal(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Progress) : { xp: 0, streak: 0, achievements: [], level: 'A1' };
  } catch {
    return { xp: 0, streak: 0, achievements: [], level: 'A1' };
  }
}
function saveLocal(p: Progress): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export async function getProgress(useMock = true, userId?: string): Promise<Progress> {
  if (useMock) return loadLocal();
  const supabase = getSupabaseClient();
  if (!supabase) return loadLocal();
  const { data, error } = await supabase.from('progress').select('*').eq('user_id', userId).single();
  if (error || !data) return loadLocal();
  return {
    userId: data.user_id,
    xp: data.xp,
    streak: data.streak,
    achievements: data.achievements || [],
    level: data.level,
    updatedAt: data.updated_at,
  };
}

export async function saveProgress(progress: Progress, useMock = true): Promise<boolean> {
  if (useMock) { saveLocal(progress); return true; }
  const supabase = getSupabaseClient();
  if (!supabase) return saveLocal(progress);
  const payload = { user_id: progress.userId, xp: progress.xp, streak: progress.streak, achievements: progress.achievements, level: progress.level };
  const { error } = await supabase.from('progress').upsert(payload);
  return !error;
}


// EMA helpers: stored per-category under EMA_KEY as record { [category]: number }

/**
 * getEMA(category) -> either:
 *  - undefined (not present)
 *  - number (legacy)
 *  - { value: number } (preferred)
 */
export function getEMA(category: string = 'translations'): { value: number } | number | undefined {
  try {
    const raw = localStorage.getItem(EMA_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    // legacy number
    if (typeof parsed === 'number') return parsed;
    if (typeof parsed === 'object' && parsed !== null) {
      const v = (parsed as Record<string, any>)[category];
      if (typeof v === 'number') return { value: v };
    }
  } catch {
    // ignore parse errors
  }
  return undefined;
}

/**
 * Aggiorna l'EMA per la categoria e ritorna il nuovo valore (0..1).
 * sample è 1 per corretto, 0 per sbagliato; alpha è il peso dell'ultimo sample.
 */
export function updateEMA(category: string, sample: number, alpha = 0.15): number {
  try {
    const raw = localStorage.getItem(EMA_KEY);
    let map: Record<string, number> = {};
    if (raw) {
      try { map = JSON.parse(raw) as Record<string, number>; } catch { map = {}; }
    }
    const prev = typeof map[category] === 'number' ? map[category] : 0.5;
    const s = Number.isFinite(sample) ? Math.max(0, Math.min(1, sample)) : 0;
    const a = Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 0.15;
    const next = a * s + (1 - a) * prev;
    map[category] = next;
    try { localStorage.setItem(EMA_KEY, JSON.stringify(map)); } catch { /* ignore */ }
    return next;
  } catch {
    return 0.5;
  }
}