import { getSupabaseClient } from './supabaseClient';

export type Progress = { userId?: string; xp: number; streak: number; achievements: string[]; level: string; updatedAt?: string };

const KEY = 'panda.progress.v1';

function loadLocal(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Progress : { xp:0, streak:0, achievements:[], level:'A1' };
  } catch { return { xp:0, streak:0, achievements:[], level:'A1' }; }
}
function saveLocal(p: Progress){
  try{ localStorage.setItem(KEY, JSON.stringify(p)); }catch{}
}

export async function getProgress(useMock = true, userId?: string): Promise<Progress> {
  if(useMock) return loadLocal();
  const supabase = getSupabaseClient();
  if(!supabase) return loadLocal();
  const { data, error } = await supabase.from('progress').select('*').eq('user_id', userId).single();
  if(error || !data) return loadLocal();
  return { userId: data.user_id, xp: data.xp, streak: data.streak, achievements: data.achievements || [], level: data.level, updatedAt: data.updated_at };
}

export async function saveProgress(progress: Progress, useMock = true): Promise<boolean> {
  if(useMock){ saveLocal(progress); return true; }
  const supabase = getSupabaseClient();
  if(!supabase) return saveLocal(progress);
  const payload = { user_id: progress.userId, xp: progress.xp, streak: progress.streak, achievements: progress.achievements, level: progress.level };
  const { error } = await supabase.from('progress').upsert(payload);
  return !error;
}


// Fix placeholder
export function getEMA() {
  return 0;
}


// Fix placeholder
export function updateEMA(value) {
  return value;
}
